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
import { Subscription } from "rxjs";
import { Observable, of } from "rxjs";

export interface DialogData {
  exportCSVData: string;
}

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent {
  ranked = <any>[];
  constructor(private rankedGames: RankedGamesService) {
    this.ranked = rankedGames.getItems();
    rankedGames.updateRanks$.subscribe(ranksData => {
      this.ranked = ranksData;
    });
  }
}
