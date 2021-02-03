import { Component, VERSION } from "@angular/core";
import { Router } from "@angular/router";
import { RankedGamesService } from "./ranked-games.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  name = "TTFL";

  constructor(private rankedGames: RankedGamesService) {}
}
