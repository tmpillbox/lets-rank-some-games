import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filterHidden",
  pure: false
})
export class FilterHiddenPipe implements PipeTransform {
  transform(items: any[], value: any): any {
    if (!items || !value) {
      return items;
    }
    return items.filter(item => item.hidden != value);
  }
}
