import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { Router } from "@angular/router";
import { ComponentMessengerService } from "../component-messenger.service";
import { RankedGamesService } from "../ranked-games.service";

@Component({
  selector: "app-tool-bar",
  templateUrl: "./tool-bar.component.html",
  styleUrls: ["./tool-bar.component.css"]
})
export class ToolBarComponent implements OnInit {
  constructor(
    private rankedGames: RankedGamesService,
    private router: Router,
    private messenger: ComponentMessengerService
  ) {}

  ngOnInit() {}

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

  isRoute(route: string) {
    return this.router.url === route;
  }

  hasQuery(query: string) {
    return this.router.parseUrl(this.router.url).queryParamMap.has(query);
  }

  hasQueryValue(param: string, value: any) {
    return (
      this.router.parseUrl(this.router.url).queryParamMap.has(param) &&
      this.router.parseUrl(this.router.url).queryParamMap.get(param) == value
    );
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

  bggSearchDoSearch() {
    this.messenger.bggSearchDoSearch.next(null);
  }

  bggSearchClearSearch() {
    this.messenger.bggSearchClearSearch.next(null);
  }

  bggSearchAddSelected() {
    this.messenger.bggSearchAddSelected.next(null);
  }
}
