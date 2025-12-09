// src/app/library/book-list/book-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book, BookService } from '../../services/book';
import { FormsModule } from '@angular/forms'; 
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-book-list',
    templateUrl: './book-list.html',
    styleUrls: ['./book-list.css'],
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule] 
})
export class BookListComponent implements OnInit {

    isModalOpen: boolean = false; 
    
    availableImages: { url: string, name: string }[] = [
        { url: '/placeholder.jpg', name: '— Без обкладинки —' },
        { url: '/TypeScript.jpg', name: 'TypeScript (Лама)' },
        { url: '/angular.png', name: 'Angular (Риба)' },
        { url: '/css.jfif', name: 'CSS Secrets' },
        { url: '/jond.jfif', name: 'HTML & CSS' },
    ];

    newBook = {
        title: '',
        author: '',
        excerpt: '',
        fullText: '',
        category: 'TypeScript',
        imageUrl: this.availableImages[0].url
    };

    availableCategories: string[] = []; 
    allBooks: Book[] = [];
    filteredBooks: Book[] = [];
    selectedCategory: string | null = null;
    isLoading: boolean = false; 

    constructor(public bookService: BookService) { } 

    ngOnInit(): void {
        this.bookService.getAllBooksAsync().subscribe((books: Book[]) => {
            this.allBooks = books;
            this.availableCategories = this.bookService.categories.filter((c: string) => c !== 'Усі Книги');
            this.filterBooks(this.selectedCategory);
            this.isLoading = false;
        });
    }

    openModal(): void {
        this.newBook = {
            title: '',
            author: '',
            excerpt: '',
            fullText: '',
            imageUrl: this.availableImages[0].url, 
            category: this.availableCategories[0] || 'TypeScript'
        };
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
    }

    confirmDelete(bookId: number, title: string): void {
        if (confirm(`Ви впевнені, що хочете видалити книгу "${title}"? Цю дію не можна скасувати.`)) {
            this.bookService.deleteBook(bookId);
        }
    }

    submitBook(): void {
        if (!this.newBook.fullText || this.newBook.fullText.trim().length < 50) {
            alert("Помилка: Текст книги обов'язковий і має бути не менше 50 символів для пагінації!"); 
            return;
        }
        
        this.isLoading = true;

        const bookData = {
            title: this.newBook.title || 'Без назви',
            author: this.newBook.author || 'Невідомий автор',
            excerpt: this.newBook.excerpt.substring(0, 100) + '...',
            fullText: this.newBook.fullText,
            category: this.newBook.category,
            imageUrl: this.newBook.imageUrl 
        };

        this.bookService.addBookToMemory(bookData)
            .then(() => {
                this.closeModal(); 
            })
            .catch(err => {
                console.error("Помилка додавання книги:", err);
                alert("Не вдалося додати книгу. Перевірте консоль.");
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    filterBooks(category: string | null): void {
        this.selectedCategory = (category === 'Усі Книги' || category === null) ? null : category;

        if (this.selectedCategory === null) {
            this.filteredBooks = this.allBooks;
        } else {
            this.filteredBooks = this.allBooks.filter(book => book.category === this.selectedCategory);
        }
    }

    isCategorySelected(category: string | null): boolean {
        if (category === 'Усі Книги') {
            return this.selectedCategory === null;
        }
        return this.selectedCategory === category;
    }
}