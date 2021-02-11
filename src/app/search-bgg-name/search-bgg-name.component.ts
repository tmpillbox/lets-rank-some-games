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
import { BGGAPISearchByNameService } from "../bggapi-search-by-name.service";
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
    // private searchService: BGGSearchByNameService,
    private searchService: BGGAPISearchByNameService,
    private messengerService: ComponentMessengerService
  ) {}

  ngOnInit() {
    if (localStorage.getItem("BGGSearch_searchBGG") !== null) {
      this.searchBGG = JSON.parse(localStorage.getItem("BGGSearch_searchBGG"));
    }
    if (localStorage.getItem("BGGSearch_searchGames") !== null) {
      this.searchGames = JSON.parse(
        localStorage.getItem("BGGSearch_searchGames")
      ).map(game => {
        var robj = new Game(game.id, game.name, game.year);
        if (game.hidden === true) {
          robj.hide();
        }
        return robj;
      });
    }
    if (localStorage.getItem("BGGSearch_selectedGames") !== null) {
      this.selectedGames = JSON.parse(
        localStorage.getItem("BGGSearch_selectedGames")
      ).map(game => {
        return new Game(game.id, game.name, game.year);
      });
    }
    this.searchTerm.valueChanges.subscribe(term => {
      if (typeof term === "string" && term != "") {
        this.searchBGG = term;
        this.updateSearchAndSelect();
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

  updateSearchAndSelect() {
    localStorage.setItem(
      "BGGSearch_searchGames",
      JSON.stringify(this.searchGames)
    );
    localStorage.setItem(
      "BGGSearch_selectedGames",
      JSON.stringify(this.selectedGames)
    );
    localStorage.setItem("BGGSearch_searchBGG", JSON.stringify(this.searchBGG));
  }

  doSearch() {
    if (typeof this.searchBGG === "string" && this.searchBGG !== "") {
      this.searchService.search(this.searchBGG).subscribe(data => {
        this.searchGames.splice(0, this.searchGames.length);
        data.forEach(result => {
          this.searchGames.push(new Game(result.id, result.name, result.year));
        });
        this.updateSearchAndSelect();
      });
    }
  }

  clearSearch() {
    this.searchBGG = "";
    this.searchGames = [];
    this.updateSearchAndSelect();
  }

  addSelected() {
    this.rankedGames.addUnsorted(this.selectedGames);
    this.selectedGames = [];
    this.updateSearchAndSelect();
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
    this.updateSearchAndSelect();
  }

  copyAndHide(hideContainer, hideIndex, copyContainer, copyIndex) {
    var hideobj = hideContainer[hideIndex];
    var copyobj = new Game(hideobj.id, hideobj.name, hideobj.year);
    hideobj.hide();
    copyContainer.splice(copyIndex, 0, copyobj);
  }

  removeSelectAndUnHideIdx(selectedIndex) {
    var game = this.selectedGames[selectedIndex];
    var gid = game.id;
    this.selectedGames.splice(selectedIndex, 1);
    var found = false;
    this.searchGames.forEach(function(game) {
      if (game.id === gid) {
        game.unhide();
        found = true;
      }
    });
    // GameID was not found
    if (!found) {
      this.searchGames.push(game);
    }
  }

  unselectGame(gameid) {
    var idx: number;
    var gobj = undefined;
    this.selectedGames.forEach((game, gameindex) => {
      if (game.id === gameid) {
        idx = gameindex;
        gobj = game;
      }
    });
    var found = false;
    this.selectedGames.splice(idx, 1);
    this.searchGames.forEach(game => {
      if (game.id === gameid) {
        game.unhide();
        found = true;
      }
    });
    if (!found) {
      this.searchGames.push(gobj);
    }
    this.updateSearchAndSelect();
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
    this.updateSearchAndSelect();
  }
}
