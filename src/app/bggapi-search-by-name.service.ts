import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { map, catchError, switchMap, mergeMap } from "rxjs/operators";
import { Observable } from "rxjs";
import "rxjs/add/observable/empty";
import { Game } from "./game";
import * as xml2js from "xml2js";

@Injectable({ providedIn: "root" })
export class BGGAPISearchByNameService {
  headers = new HttpHeaders().set("accept", "application/json, text/plain");
  requestURL = "https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=";
  getURL = this.requestURL;
  parser = new xml2js.Parser({ strict: false, trim: true });

  static score(pGameName: string, pSearchTerm: string) {
    var gameName = pGameName.toLocaleLowerCase().split(/\W/);
    var searchTerm = pSearchTerm.toLocaleLowerCase().split(/\W/);
    var score = 0;
    if (pGameName.toLowerCase() === pSearchTerm.toLocaleLowerCase()) {
      return -10000;
    }
    searchTerm.forEach(searchToken => {
      gameName.forEach(gameToken => {
        var i = gameToken.indexOf(searchToken);
        if (i > 0) {
          score -= i / gameToken.length;
        } else {
          score += 1;
        }
      });
    });
    return score;
  }

  constructor(private http: HttpClient) {}
  search(term) {
    if (typeof term === "undefined") {
      return;
    }
    var listOfGamesObj = this.http
      .get(this.getURL + term, {
        headers: this.headers,
        responseType: "text"
      })
      .pipe(
        debounceTime(500), // WAIT FOR 500 MILLISECONDS AFTER EACH KEY STROKE.
        switchMap(data => {
          var tmp;
          this.parser.parseString(data, (err, result) => {
            if (
              typeof result !== "undefined" &&
              typeof result["ITEMS"] !== "undefined" &&
              typeof result["ITEMS"]["ITEM"] !== "undefined"
            ) {
              tmp = result["ITEMS"]["ITEM"].map(function(itemHandle) {
                const robj = {
                  id: "-1",
                  name: "",
                  year: "0"
                };
                if ("$" in itemHandle && "ID" in itemHandle["$"]) {
                  robj.id = itemHandle["$"]["ID"];
                }
                if (
                  "NAME" in itemHandle &&
                  typeof itemHandle["NAME"][0] !== "undefined"
                ) {
                  robj.name = itemHandle["NAME"][0]["$"]["VALUE"];
                }
                if (
                  "YEARPUBLISHED" in itemHandle &&
                  typeof itemHandle["YEARPUBLISHED"][0] !== "undefined"
                ) {
                  robj.year = itemHandle["YEARPUBLISHED"][0]["$"]["VALUE"];
                }
                return robj;
              });
            }
          });
          return [tmp];
        }), // CONVERT XML TO JSON
        switchMap((data: any[]) => {
          return [
            data.map(itemHandle => {
              var robj = {
                id: +itemHandle["id"],
                name: "" + itemHandle["name"],
                year: "" + itemHandle["year"],
                sortscore: BGGAPISearchByNameService.score(
                  itemHandle["name"],
                  term
                )
              };
              return robj;
              //var robj = new Game(
              //  itemHandle["id"],
              //  itemHandle["name"],
              //  itemHandle["year"]
              //);
            })
          ];
        }),
        map(data => {
          return data.sort((a, b) => {
            if (a.sortscore < b.sortscore) {
              return -1;
            }
            if (a.sortscore > b.sortscore) {
              return 1;
            }
            return 0;
          });
          return this.sortByRelevance(data, "name", term);
        }),
        map(x => x.slice(0, 200))
      );
    return listOfGamesObj;
  }

  sortByRelevance(sortList: any[], field: string, searchTerm: string) {
    if (!Array.isArray(sortList)) {
      return;
    }
    sortList.sort((a: any, b: any) => {
      if (a[field] === searchTerm) {
        return -1;
      }
      if (b[field] === searchTerm) {
        return 1;
      }
      var ia = a[field].lastIndexOf(searchTerm);
      var ib = b[field].lastIndexOf(searchTerm);
      if (ia === 0) {
        return -1;
      }
      if (ib === 0) {
        return 1;
      }
      if (ia < ib) {
        return -1;
      }
      if (ia > ib) {
        return 1;
      }
      return 0;
    });
    return sortList;
  }
}
