import { Component, OnInit, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { RankedGamesService } from "../ranked-games.service";
import { MatFormField } from "@angular/material/form-field";
import { FormControl } from "@angular/forms";

export interface DialogData {
  exportCSVData: string;
}

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"],
  providers: [RankedGamesService]
})
export class TopBarComponent {
  ranked = <any>[];
  constructor(private rankedGames: RankedGamesService) {
    this.ranked = rankedGames.getItems();
    rankedGames.updateRanks$.subscribe(ranksData => {
      console.log("number ranked games: " + this.rankedGames.rankedGamesCount);
      this.ranked = ranksData;
    });
  }
}
