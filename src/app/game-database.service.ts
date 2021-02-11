import { Injectable } from "@angular/core";
import { Game } from "./game";

@Injectable()
export class GameDatabaseService {
  public games = new Map<number, Game>();
  public idsByName = new Map<string, number>();
  constructor() {}

  has_id(gameid) {
    return this.games.has(gameid);
  }

  has_name(gamename) {
    return (
      this.idsByName.has(gamename) && this.games.has(this.idsByName[gamename])
    );
  }

  get_by_id(gameid) {
    if (this.has_id(gameid)) {
      return this.games[gameid];
    }
    return undefined;
  }

  get_by_name(gamename) {
    if (this.has_name(gamename)) {
      return this.get_by_id(this.idsByName[gamename]);
    }
    return undefined;
  }

  get(id_or_name) {
    if (typeof id_or_name == "number") {
      return this.get_by_id(id_or_name);
    }
    if (typeof id_or_name == "string") {
      return this.get_by_name(id_or_name);
    }
    if (id_or_name.hasOwnProperty("id")) {
      return this.get_by_id(id_or_name.id);
    }
    if (id_or_name.hasOwnProperty("name")) {
      return this.get_by_name(id_or_name.name);
    }
    return undefined;
  }
}
