import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listBook'
})
export class listBookPipe implements PipeTransform {

  transform(items: any, bookId: any) {
    // when our serach is undefined or null
    if (!bookId) {
      return items;
    }

    // when there is partial or full match of the search term
    return items.filter((x: any) => x.list_id == bookId);
  }
}
