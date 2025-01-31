import { Component, WritableSignal, computed } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { BooksService } from '../services/books.service';
import { Books, BooksResponse } from '../interfaces/Books';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent {
  errorMessage = "";
  showModal = false;
  working = false;
  newBook: Books = { id: 0, title: "", name: "", year: "", list_id: 0 };
  listItems: any;
  constructor(public bookService: BooksService) {
    this.bookService.getBooks();
    this.bookService.getLists();
  }

  // Component signals
  books = computed(() => {
    try {
      return this.bookService.booksSignal();
    } catch (e) {
      this.errorMessage = typeof e === 'string' ? e : 'Error';
      return [];
    }
  });

  action = "";
  selectedbook = this.bookService.selectedbook;
  onSelected(id: number, target: string): void {
    this.bookService.bookSelected(id);
    this.selectedbook = this.bookService.selectedbook;
    if (target == 'save') {
      this.listItems = this.bookService.listsGeneral;
      let title = this.selectedbook() ? String(this.selectedbook()?.title) : "";
      let year = this.selectedbook() ? String(this.selectedbook()?.year) : "";
      let name = this.selectedbook() ? String(this.selectedbook()?.name) : "";
      let list_id = this.selectedbook() && this.selectedbook()?.list_id ? Number(this.selectedbook()?.list_id) : 0;
      this.newBook = { id: id, title: title, year: year, name: name, list_id: list_id }
    } else {
      this.newBook = { id: 0, title: "", name: "", year: "", list_id: 0 };
    }
    this.action = target;
    this.showModal = true;
  }

  deleteProcess() {
    let id = this.selectedbook() ? Number(this.selectedbook()?.id) : 0;
    this.bookService.deleteBook(id);
    this.closePopup();
  }

  editProcess() {
    if (this.newBook.id == 0) {
      this.bookService.addBook({ id: 0, title: this.newBook.title, year: this.newBook.year, name: this.newBook.name });
    } {
      let id = this.selectedbook() ? Number(this.selectedbook()?.id) : 0;
      this.bookService.editBook({ id: id, title: this.newBook.title, year: this.newBook.year, name: this.newBook.name });
    }
    this.closePopup();
  }

  closePopup() {
    this.showModal = false;
  }


}
