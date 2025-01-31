import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, Signal, signal } from '@angular/core';
import { Observable, catchError, map, retry, shareReplay, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { BooksResponse, Books } from '../interfaces/Books';
import { Lists, ListsResponse } from '../interfaces/Lists';

@Injectable({ providedIn: 'root' })
export class ListsService {
    public listsSignal = signal<Lists[] | null>([]);

    constructor(private http: HttpClient) { }

    getLists() {
        this.http
            .get<ListsResponse>(environment.API_URL + 'api/lists')
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe((listsResp) => {
                this.listsSignal.set(listsResp.results)
            })
    }

    selectedlist = signal<Lists | undefined>(undefined);
    listSelected(id: number) {
        const foundlist = this.listsSignal()?.find((l: any) => l.id === id);
        this.selectedlist.set(foundlist);
    }

    deletelist(id: number | null) {
        this.http
            .delete<ListsResponse>(environment.API_URL + 'api/lists', { body: { "id": id } })
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe((booksResp) => {
                this.listsSignal.update((items: any) => items.filter((item: any) => item.id !== id));
            })
    }

    addList(_obj: Lists) {
        this.http
            .post<ListsResponse>(environment.API_URL + 'api/lists', _obj)
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe((booksResp) => {
                this.getLists();
                // this.booksSignal.update((items: any) => items.push(booksResp.results));
            })
    }

    editList(_obj: Lists) {
        this.http
            .put<BooksResponse>(environment.API_URL + 'api/lists', _obj)
            .pipe(
                retry(1),
                catchError(this.handleError)
            ).subscribe((booksResp) => {
                this.getLists();
                // this.booksSignal.update((items: any) => items.push(booksResp.results));
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