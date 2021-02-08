export interface IGame {
  id: number;
  name: string;
  year: string;
  hidden: boolean;
}
export class Game implements IGame {
  public id: number;
  public name: string;
  public year: string;
  public hidden: boolean;
  constructor(id: number, name: string, year: string, hidden: boolean = false) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.hidden = hidden;
  }

  hide() {
    this.hidden = true;
  }

  unhide() {
    this.hidden = false;
  }
}
