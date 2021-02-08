import { Component, OnInit } from "@angular/core";
import { RankedGamesService } from "../ranked-games.service";
import { FormControl } from "@angular/forms";
import { ComponentMessengerService } from "../component-messenger.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { Game } from "../game";
import { BGGSearchByNameService } from "../bgg-search-by-name.service";
import { FilterHiddenPipe } from "../filter-hidden.pipe";

@Component({
  selector: "app-search-bgg-name",
  templateUrl: "./search-bgg-name.component.html",
  styleUrls: ["./search-bgg-name.component.css"]
})
export class SearchBggNameComponent implements OnInit {
  searchTerm: FormControl = new FormControl();
  searchGames = <any>[];
  selectedGames = <any>[];

  searchBGG: string;

  constructor(
    private rankedGames: RankedGamesService,
    private searchService: BGGSearchByNameService,
    private messengerService: ComponentMessengerService
  ) {}

  ngOnInit() {
    this.searchTerm.valueChanges.subscribe(term => {
      if (typeof term === "string" && term != "") {
        this.searchBGG = term;
      }
    });
    this.messengerService.bggSearchAddSelected.subscribe(data => {
      this.addSelected();
    });
    this.messengerService.bggSearchClearSearch.subscribe(data => {
      this.clearSearch();
    });
    this.messengerService.bggSearchDoSearch.subscribe(data => {
      this.doSearch();
    });
  }

  doSearch() {
    if (typeof this.searchBGG === "string" && this.searchBGG !== "") {
      this.searchService.search(this.searchBGG).subscribe(data => {
        this.searchGames.splice(0, this.searchGames.length);
        data.forEach(result => {
          this.searchGames.push(new Game(result.id, result.name, result.year));
        });
      });
    }
  }

  clearSearch() {
    this.searchBGG = "";
    this.searchGames = [];
  }

  addSelected() {
    this.rankedGames.addUnsorted(this.selectedGames);
    this.selectedGames = [];
  }

  drop(event: any): void {
    if (event.container.data === this.searchGames) {
      if (event.previousContainer.data === this.searchGames) {
        // nothing happens
      } else if (event.previousContainer.data === this.selectedGames) {
        // unhide search result and remove from selected
        this.removeSelectAndUnHideIdx(event.previousIndex);
      }
    } else if (event.container.data === this.selectedGames) {
      if (event.previousContainer.data === this.selectedGames) {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else if (event.previousContainer.data === this.searchGames) {
        // copy to selected list, hide search result
        this.copyAndHide(
          event.previousContainer.data,
          event.previousIndex,
          event.container.data,
          event.currentIndex
        );
      }
    }
  }

  copyAndHide(hideContainer, hideIndex, copyContainer, copyIndex) {
    var hideobj = hideContainer[hideIndex];
    var copyobj = new Game(hideobj.id, hideobj.name, hideobj.year);
    hideobj.hide();
    copyContainer.splice(copyIndex, 0, copyobj);
  }

  removeSelectAndUnHideIdx(selectedIndex) {
    var gid = this.selectedGames[selectedIndex].id;
    this.selectedGames.splice(selectedIndex, 1);
    this.searchGames.forEach(function(game) {
      if (game.id === gid) {
        game.unhide();
      }
    });
  }

  unselectGame(gameid) {
    var idx: number;
    this.selectedGames.forEach((game, gameindex) => {
      if (game.id === gameid) {
        idx = gameindex;
      }
    });
    this.selectedGames.splice(idx, 1);
    this.searchGames.forEach(game => {
      if (game.id === gameid) {
        game.unhide();
      }
    });
  }

  selectGame(gameid) {
    this.selectedGames.forEach(game => {
      if (game.id === gameid) {
        return;
      }
    });
    this.searchGames.forEach(game => {
      if (game.id === gameid) {
        this.selectedGames.push(new Game(game.id, game.name, game.year));
        game.hide();
      }
    });
  }
}
