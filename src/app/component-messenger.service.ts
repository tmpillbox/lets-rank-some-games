import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class ComponentMessengerService {
  constructor() {}

  bggSearchDoSearch = new Subject();
  bggSearchClearSearch = new Subject();
  bggSearchAddSelected = new Subject();
}
