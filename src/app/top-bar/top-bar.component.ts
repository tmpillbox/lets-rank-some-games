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
import { Game } from "../game";

export interface DialogData {
  exportCSVData: string;
}

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"]
})
export class TopBarComponent implements OnInit {
  public ranked = [] as Game[];
  constructor(
    private rankedGames: RankedGamesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.ranked = this.rankedGames.getItems();
    this.rankedGames.updateRanks$.subscribe(ranksData => {
      this.ranked = ranksData;
    });
  }
  hasRoute(route: string) {
    return this.router.url === route;
  }

  rankedGamesCount() {
    if (this.ranked.length == 1) {
      return "1 Game Ranked";
    }
    return "" + this.ranked.length + " Games Ranked";
  }
}
