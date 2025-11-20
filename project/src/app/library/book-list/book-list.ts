// /src/app/library/book-list/book-list.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book, BookService } from '../../services/book';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class BookListComponent implements OnInit {

  categories: string[] = ['TypeScript', 'Angular', 'CSS/HTML'];
  allBooks: Book[] = [];
  filteredBooks: Book[] = [];

  selectedCategory: string | null = null;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.allBooks = this.bookService.getAllBooks();
    this.filterBooks(null);
  }

  filterBooks(category: string | null): void {
    this.selectedCategory = category;

    if (category === null) {
      this.filteredBooks = this.allBooks;
    } else {
      this.filteredBooks = this.allBooks.filter(book => book.category === category);
    }
  }

  isCategorySelected(category: string | null): boolean {
    return this.selectedCategory === category;
  }
}
