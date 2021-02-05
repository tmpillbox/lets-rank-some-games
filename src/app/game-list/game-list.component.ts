import { Injectable, Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { HttpClient } from "@angular/common/http";
import { FormControl } from "@angular/forms";

import { Game } from "../game";
import { RankedGamesService } from "../ranked-games.service";
import { Subscription } from "rxjs";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import * as xml2js from "xml2js";
import { hasPropertyNameText } from "@angular/cdk/schematics/update-tool/utils/property-name";
import { BGGSearchByNameService } from "../bgg-search-by-name.service";

@Injectable({ providedIn: "root" })
export class BGGAPISearchService {
  constructor(private http: HttpClient) {}
  parser = new xml2js.Parser({ strict: false, trim: true });
  search(term) {
    var listOfGamesObj = this.http
      .get(
        "https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=" + term,
        {
          responseType: "text"
        }
      )
      .pipe(
        debounceTime(500), // WAIT FOR 500 MILLISECONDS AFTER EACH KEY STROKE.
        map(data => {
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
          return typeof tmp === "undefined" ? [] : tmp;
        }),
        map(x => x.slice(0, 200))
      );
    return listOfGamesObj;
  }
}

@Injectable({ providedIn: "root" })
export class BGGAPIGetByIDService {
  constructor(private http: HttpClient) {}
  parser = new xml2js.Parser({ strict: false, trim: true });
  getByID(gameid) {
    var gameObj = this.http
      .get("https://boardgamegeek.com/xmlapi2/thing?id=" + gameid, {
        responseType: "text"
      })
      .pipe(
        debounceTime(500), // WAIT FOR 500 MILLISECONDS AFTER EACH KEY STROKE.
        map(data => {
          var tmp;
          debugger;
          this.parser.parseString(data, (err, result) => {
            if (
              typeof result !== "undefined" &&
              typeof result["ITEMS"] !== "undefined" &&
              typeof result["ITEMS"]["ITEM"] !== "undefined"
            ) {
              const robj = {
                id: "-1",
                name: "",
                year: "0"
              };
              if ("$" in result["ITEMS"] && "ID" in result["$"]) {
                robj.id = result["$"]["ID"];
              }
              if (
                "NAME" in result &&
                typeof result["NAME"][0] !== "undefined"
              ) {
                robj.name = result["NAME"][0]["$"]["VALUE"];
              }
              if (
                "YEARPUBLISHED" in result &&
                typeof result["YEARPUBLISHED"][0] !== "undefined"
              ) {
                robj.year = result["YEARPUBLISHED"][0]["$"]["VALUE"];
              }
              return robj;
            }
          });
        })
      );
    return gameObj;
  }
}

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
  providers: [BGGSearchByNameService]
})
export class GameListComponent implements OnInit {
  sorted: Game[];
  unsorted: Game[];

  searchTerm: FormControl = new FormControl();
  searchResults = <any>[];

  searchBGG: string;

  constructor(
    private rankedGames: RankedGamesService,
    private searchService: BGGSearchByNameService
  ) {
    this.sorted = this.rankedGames.getItems();
    this.unsorted = this.rankedGames.getUnsorted();
    rankedGames.updateRanks$.subscribe(ranksData => {
      this.sorted = ranksData;
    });
    rankedGames.updateUnsorted$.subscribe(unsortedData => {
      this.unsorted = unsortedData;
    });
  }

  ngOnInit() {
    this.searchTerm.valueChanges.subscribe(term => {
      if (typeof term === "string" && term != "") {
        this.searchService.search(term).subscribe(data => {
          this.searchResults = data as any[];
        });
      }
    });
  }

  drop(event: any): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.updateServiceData();
  }

  updateServiceData() {
    this.rankedGames.setRanks(this.sorted);
    this.rankedGames.setUnsorted(this.unsorted);
  }

  removeGame(gameid) {
    const tmp = this.unsorted.filter(game => game.id !== gameid);
    this.rankedGames.setUnsorted(tmp);
  }

  addUnsortedByID(gameid, gamename) {
    this.rankedGames.addUnsorted([{ id: gameid, name: gamename }]);
    this.searchBGG = "";
  }

  addGameByBGGID(gameid) {}

  renderRankNumber(i) {
    return i + 1;
  }
}
