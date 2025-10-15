import { Routes } from '@angular/router';

import { BookListComponent } from './library/book-list/book-list'; 
import { ReaderComponent } from './library/reader/reader'; 

export const routes: Routes = [
    { path: 'library', component: BookListComponent },
    { path: 'read/:id', component: ReaderComponent },
    { path: '', redirectTo: '/library', pathMatch: 'full' },
    { path: '**', redirectTo: '/library' }
];
