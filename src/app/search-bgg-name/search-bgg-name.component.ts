import { Component, OnInit } from "@angular/core";
import { RankedGamesService } from "../ranked-games.service";

@Component({
  selector: "app-search-bgg-name",
  templateUrl: "./search-bgg-name.component.html",
  styleUrls: ["./search-bgg-name.component.css"]
})
export class SearchBggNameComponent implements OnInit {
  constructor(rankedGames: RankedGamesService) {}

  ngOnInit() {}
}
