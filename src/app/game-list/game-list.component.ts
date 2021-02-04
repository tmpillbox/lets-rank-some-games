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
import { map } from "rxjs/operators";
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import * as xml2js from "xml2js";

@Injectable({ providedIn: "root" })
export class BGGAPISearchService {
  constructor(private http: HttpClient) {}
  parser = new xml2js.Parser({ strict: false, trim: true });
  search(term) {
    var listOfGames = this.http
      .get(
        "https://boardgamegeek.com/xmlapi2/search?type=boardgame&query=" + term,
        {
          responseType: "text"
        }
      )
      .pipe(
        debounceTime(500), // WAIT FOR 500 MILLISECONDS AFTER EACH KEY STROKE.
        map((data: any) => {
          var tmp2: string;
          this.parser.parseString(data.text, (err, result) => (tmp2 = result));
          console.log("tmp2: " + tmp2);
          return data.length != 0 ? JSON.parse(tmp2) : [{ name: "not found" }];
        })
      );
    console.log("search results: " + JSON.stringify(listOfGames));
    return listOfGames;
  }
}

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
  providers: [BGGAPISearchService]
})
export class GameListComponent implements OnInit {
  sorted = [];
  unsorted = [];

  searchTerm: FormControl = new FormControl();
  searchResults = <any>[];

  constructor(
    private rankedGames: RankedGamesService,
    private searchService: BGGAPISearchService
  ) {
    rankedGames.updateRanks$.subscribe(ranksData => {
      this.sorted = ranksData;
    });
    rankedGames.updateUnsorted$.subscribe(unsortedData => {
      this.unsorted = unsortedData;
    });
  }

  ngOnInit() {
    this.searchTerm.valueChanges.subscribe(term => {
      if (term != "") {
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
}
