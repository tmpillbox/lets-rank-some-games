import { Injectable } from "@angular/core";
import { sample_games } from "./sample-games";
import { Subject } from "rxjs";
import { Game } from "./game";
import { ClipboardService } from "ngx-clipboard";

@Injectable({ providedIn: "root" })
export class RankedGamesService {
  private updateRanksSource = new Subject<Game[]>();
  private updateUnsortedSource = new Subject<Game[]>();

  updateRanks$ = this.updateRanksSource.asObservable();
  updateUnsorted$ = this.updateUnsortedSource.asObservable();

  games = [];
  unsorted = [];
  rankedGamesCount = 0;
  unrankedGamesCount = 0;

  constructor(private clipboard: ClipboardService) {
    this.games = JSON.parse(localStorage.getItem("rankedGames"));
    this.unsorted = JSON.parse(localStorage.getItem("unrankedGames"));
  }

  setRanks(games) {
    this.games = games;
    localStorage.setItem("rankedGames", JSON.stringify(this.games));
    this.rankedGamesCount = this.games.length;
    this.updateRanksSource.next(this.games);
  }

  setUnsorted(games) {
    this.unsorted = games;
    localStorage.setItem("unrankedGames", JSON.stringify(this.unsorted));
    this.unrankedGamesCount = this.unsorted.length;
    this.updateUnsortedSource.next(this.unsorted);
  }

  addUnsorted(games) {
    const tmp = JSON.parse(JSON.stringify(this.unsorted));
    games.forEach(game => {
      if (!this.inList(game.id)) {
        tmp.push(game);
      }
    });
    this.setUnsorted(tmp);
  }

  inRanked(gameid) {
    return this.games.some(game => {
      return game.id == gameid;
    });
  }

  inUnsorted(gameid) {
    console.log("scanning unsorted list for game id: " + gameid);
    return this.unsorted.some(game => {
      return game.id == gameid;
    });
  }

  inList(gameid) {
    return this.inRanked(gameid) || this.inUnsorted(gameid);
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
    const tmp = JSON.parse(JSON.stringify(sample_games));
    this.addUnsorted(tmp);
  }

  saveToLocal() {
    localStorage.setItem("SaveRankedGames", JSON.stringify(this.games));
    localStorage.setItem("SaveUnrankedGames", JSON.stringify(this.unsorted));
  }

  loadFromLocal() {
    this.setRanks(JSON.parse(localStorage.getItem("SaveRankedGames")));
    this.setUnsorted(JSON.parse(localStorage.getItem("SaveUnrankedGames")));
  }

  exportCSV(): string {
    const csvString = [
      ["Rank", "ID", "Name"],
      ...this.games.map((item, idx) => [idx + 1, item.id, item.name])
    ];
    return csvString.map(e => e.join(",")).join("\n");
  }

  copyToClipboard() {
    this.clipboard.copy(this.exportCSV());
  }
}
