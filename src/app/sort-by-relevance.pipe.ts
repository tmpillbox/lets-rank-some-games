import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortByRelevance",
  pure: false
})
export class SortByRelevancePipe implements PipeTransform {
  transform(sortList: any[], field: string, searchTerm: string): any {
    if (!Array.isArray(sortList)) {
      return;
    }
    sortList.sort((a: any, b: any) => {
      if (a[field] === searchTerm) {
        return -1;
      }
      if (b[field] === searchTerm) {
        return 1;
      }
      var ia = a[field].lastIndexOf(searchTerm);
      var ib = b[field].lastIndexOf(searchTerm);
      if (ia < ib) {
        return -1;
      }
      if (ia > ib) {
        return 1;
      }
      return 0;
    });
    return sortList;
  }
}
