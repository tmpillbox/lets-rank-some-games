import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { map, catchError } from "rxjs/operators";
import { Observable } from "rxjs";
import "rxjs/add/observable/empty";

@Injectable({ providedIn: "root" })
export class BGGSearchByNameService {
  headers = new HttpHeaders().set("accept", "application/json, text/plain");
  proxyURL = "https://cors-anywhere.herokuapp.com/";
  requestURL = "https://boardgamegeek.com/search/boardgame?nosession=1&q=";
  getURL = this.proxyURL + this.requestURL;

  constructor(private http: HttpClient) {}
  search(term) {
    if (typeof term === "undefined") {
      return;
    }
    var listOfGamesObj = this.http
      .get(this.getURL + term, {
        headers: this.headers,
        responseType: "json"
      })
      .pipe(
        debounceTime(500), // WAIT FOR 500 MILLISECONDS AFTER EACH KEY STROKE.
        map(data => {
          return data["items"].map(function(itemHandle) {
            var robj = {
              id: "" + itemHandle["id"],
              href: "" + itemHandle["href"],
              name: "" + itemHandle["name"],
              year: "" + itemHandle["yearpublished"],
              imgid: "" + itemHandle["rep_imageid"]
            };
            return robj;
          });
        })
      );
    return listOfGamesObj;
  }
}
