import { Component, OnInit, Input } from "@angular/core";
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
import { debounceTime } from "rxjs/internal/operators/debounceTime";



@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"]
})
export class GameListComponent implements OnInit {
  sorted = [];
  unsorted = [];
  constructor(private rankedGames: RankedGamesService) {
    rankedGames.updateRanks$.subscribe(ranksData => {
      this.sorted = ranksData;
    });
    rankedGames.updateUnsorted$.subscribe(unsortedData => {
      this.unsorted = unsortedData;
    });
  }

  ngOnInit() {}

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
