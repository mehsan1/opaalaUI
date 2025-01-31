import { Routes } from '@angular/router';
import { BookComponent } from './book/book.component';
import { ListComponent } from './list/list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'book',
    },
    {
        path: 'book',
        component: BookComponent,
    },
    {
        path: 'list',
        component: ListComponent,
    },
];
