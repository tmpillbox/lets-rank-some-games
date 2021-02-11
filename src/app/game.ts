export interface IGame {
  id: number;
  name: string;
  year: string;
  hidden: boolean;
  bggimageid: string;
  imageurl: string;
}
export class Game implements IGame {
  static fromData(data: IGame): Game {
    const {
      id,
      name,
      year,
      hidden = false,
      bggimageid = "",
      imageurl = ""
    } = data;
    return new this(id, name, year, hidden, bggimageid, imageurl);
  }
  public id: number;
  public name: string;
  public year: string;
  public hidden: boolean;
  public bggimageid: string;
  public imageurl: string;
  public in_ranked: boolean;
  public in_unranked: boolean;
  public in_searchSelected: boolean;
  public in_listSelected: boolean;
  constructor(
    id: number,
    name: string,
    year: string,
    hidden: boolean = false,
    bggimageid = "",
    imageurl = ""
  ) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.hidden = hidden;
    this.bggimageid = bggimageid;
    this.imageurl = imageurl;
  }

  hide() {
    this.hidden = true;
  }

  unhide() {
    this.hidden = false;
  }
}
