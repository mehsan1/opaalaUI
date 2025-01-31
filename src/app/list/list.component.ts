import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lists } from '../interfaces/Lists';
import { ListsService } from '../services/list.service';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../services/books.service';


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  errorMessage = "";
  showModal = false;
  working = false;
  newList: Lists = { id: 0, title: "" };
  constructor(public listService: ListsService, private bookService: BooksService) {
    this.listService.getLists();
    this.bookService.getBooks();
  }

  // Component signals
  _list = computed(() => {
    try {
      return this.listService.listsSignal();
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  action = "";
  selectedlist = this.listService.selectedlist;
  booksByList: any;
  onSelected(id: number, target: string): void {
    this.listService.listSelected(id);
    this.selectedlist = this.listService.selectedlist;
    if (target == 'save') {
      const title = this.selectedlist() ? String(this.selectedlist()?.title) : "";
      this.newList = { id: id, title: title }
    } else if (target == 'add') {
      this.newList = { id: 0, title: "" };
    } else if (target == 'viewbooks') {
      this.booksByList = this.bookService.booksSignal();
    }
    this.action = target;
    this.showModal = true;
  }

  selectedbook = this.bookService.selectedbook;

  processAssociation(id: number, action: string) {
    this.bookService.bookSelected(id);
    this.selectedbook = this.bookService.selectedbook;
    const title = this.selectedbook() ? String(this.selectedbook()?.title) : "";
    const year = this.selectedbook() ? String(this.selectedbook()?.year) : "";
    const name = this.selectedbook() ? String(this.selectedbook()?.name) : "";
    let list_id = 0;
    if (action == 'assign') {
      list_id = this.selectedlist() && this.selectedlist()?.id ? Number(this.selectedlist()?.id) : 0;
    }
    const obj = { id: id, title: title, year: year, name: name, list_id: list_id };
    this.bookService.editBook(obj);
    this.bookService.booksSignal.update(() => {
      const index = this.booksByList.findIndex((t:any) => t.id === obj.id);
      this.booksByList[index] = obj
      return this.booksByList
    })
  }

  getAssignedBooks() {
    const id = this.selectedlist() ? Number(this.selectedlist()?.id) : 0;
    return this.booksByList.filter((x: any) => x.list_id == id);
  }

  getUnAssignedBooks() {
    return this.booksByList.filter((x: any) => !x.list_id);
  }

  deleteProcess() {
    const id = this.selectedlist() ? Number(this.selectedlist()?.id) : 0;
    this.listService.deletelist(id);
    this.closePopup();
  }

  editProcess() {
    if (this.newList.id == 0) {
      this.listService.addList({ id: 0, title: this.newList.title });
    } {
      const id = this.selectedlist() ? Number(this.selectedlist()?.id) : 0;
      this.listService.editList({ id: id, title: this.newList.title });
    }
    this.closePopup();
  }

  closePopup() {
    this.showModal = false;
  }


}
