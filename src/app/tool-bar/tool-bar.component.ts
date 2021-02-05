import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { Router } from "@angular/router";
import { RankedGamesService } from "../ranked-games.service";

@Component({
  selector: "app-tool-bar",
  templateUrl: "./tool-bar.component.html",
  styleUrls: ["./tool-bar.component.css"]
})
export class ToolBarComponent implements OnInit {
  constructor(
    private rankedGames: RankedGamesService,
    private router: Router
  ) {}

  ngOnInit() {}

  hasRoute(route: string) {
    return this.router.url === route;
  }

  loadSampleData() {
    this.rankedGames.loadSampleData();
  }

  saveToLocal() {
    this.rankedGames.saveToLocal();
  }

  loadFromLocal() {
    this.rankedGames.loadFromLocal();
  }

  copyToClipboard() {
    this.rankedGames.copyToClipboard();
  }
}
