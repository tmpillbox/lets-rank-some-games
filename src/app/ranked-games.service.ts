import { Injectable } from "@angular/core";
import { sample_games } from "./sample-games";
import { Subject } from "rxjs";
import { Game } from "./game";

@Injectable({ providedIn: "root" })
export class RankedGamesService {
  private updateRanksSource = new Subject<Game[]>();
  private updateUnsortedSource = new Subject<Game[]>();

  updateRanks$ = this.updateRanksSource.asObservable();
  updateUnsorted$ = this.updateUnsortedSource.asObservable();

  games = [];
  unsorted = [];

  constructor() {}

  setRanks(games) {
    this.games = games;
    this.updateRanksSource.next(this.games);
  }

  setUnsorted(games) {
    this.unsorted = games;
    this.updateUnsortedSource.next(this.unsorted);
  }

  getItems() {
    return this.games;
  }

  getUnsorted() {
    return this.unsorted;
  }

  clearRanks() {
    this.setRanks([]);
    return this.games;
  }

  loadSampleData() {
    console.log("loaded Sample Data");
    this.setUnsorted(sample_games);
  }
}
