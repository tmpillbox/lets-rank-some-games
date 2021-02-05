import { Component, OnInit } from "@angular/core";
import { RankedGamesService } from "../ranked-games.service";

@Component({
  selector: "app-game-export",
  templateUrl: "./game-export.component.html",
  styleUrls: ["./game-export.component.css"]
})
export class GameExportComponent implements OnInit {
  exportCSVData: string;
  constructor(private rankedGames: RankedGamesService) {}

  ngOnInit() {
    this.exportCSVData = this.rankedGames.exportCSV();
    console.log(this.exportCSVData);
  }
}
