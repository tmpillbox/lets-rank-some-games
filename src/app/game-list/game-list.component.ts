import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { games } from "../games";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"]
})
export class GameListComponent implements OnInit {
  games = games;
  constructor() {}

  ngOnInit() {}

  drop(event: any): void {
    console.log(event);
    moveItemInArray(this.games, event.previousIndex, event.currentIndex);
  }
}
