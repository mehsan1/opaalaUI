import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BooksResponse, Books } from '../interfaces/Books';
import { ListsResponse } from '../interfaces/Lists';

@Injectable({ providedIn: 'root' })
export class BooksService {
    public booksSignal = signal<Books[] | null>([]);
    public listsGeneral : any  = [];

    constructor(private http: HttpClient) { }

    getBooks() {
        this.http
            .get<BooksResponse>(environment.API_URL + 'api/books')
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe((booksResp) => {
                this.booksSignal.set(booksResp.results);
            })
    }

    getLists() {
        this.http
            .get<ListsResponse>(environment.API_URL + 'api/lists')
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe((listsResp) => {
                this.listsGeneral = listsResp.results
            })
    }

    selectedbook = signal<Books | undefined>(undefined);
    bookSelected(id: number) {
        const foundBook = this.booksSignal()?.find((b: any) => b.id === id);
        this.selectedbook.set(foundBook);
    }

    deleteBook(id: number | null) {
        this.http
            .delete<BooksResponse>(environment.API_URL + 'api/books', { body: { "id": id } })
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe(() => {
                this.booksSignal.update((items: any) => items.filter((item: any) => item.id !== id));
            })
    }

    addBook(_book: Books) {
        this.http
            .post<BooksResponse>(environment.API_URL + 'api/books', _book)
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe(() => {
                this.getBooks();
            })
    }

    editBook(_book: Books) {
        this.http
            .put<BooksResponse>(environment.API_URL + 'api/books', _book)
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe(() => {
                this.getBooks();
            })
    }

    private handleError(err: HttpErrorResponse): Observable<never> {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            console.log(err);
            errorMessage = `Server returned code: ${err.status}, error message is: ${err.message
                }`;
        }
        console.error(errorMessage);
        return throwError(() => errorMessage);
    }
}