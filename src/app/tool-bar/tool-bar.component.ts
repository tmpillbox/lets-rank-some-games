import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { RankedGamesService } from "../ranked-games.service";

@Component({
  selector: "app-tool-bar",
  templateUrl: "./tool-bar.component.html",
  styleUrls: ["./tool-bar.component.css"]
})
export class ToolBarComponent implements OnInit {
  constructor(private rankedGames: RankedGamesService) {}

  ngOnInit() {}

  loadSampleData() {
    console.log("toolbar loadSampleData");
    this.rankedGames.loadSampleData();
  }
}
