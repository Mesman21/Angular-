// src/app/services/book.service.ts

import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, of, BehaviorSubject } from 'rxjs'; 
import { map } from 'rxjs/operators'; 
import { isPlatformBrowser } from '@angular/common';

export interface Book {
    id: number;
    title: string;
    author: string;
    excerpt: string;
    fullTextSource?: string;
    fullText?: string;
    imageUrl?: string;
    category: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookService {
    
    private readonly STORAGE_KEY = 'local_angular_books';
    private nextId = 5;
    private booksSubject = new BehaviorSubject<Book[]>([]); 
    private isBrowser: boolean;
    
    public readonly categories: string[] = [
        'Усі Книги',
        'TypeScript',
        'Angular',
        'CSS/HTML'
    ];

    private initialBooks: Book[] = [
        { id: 1, title: "Programming TypeScript", author: "Boris Cherny", excerpt: "Масштабування JavaScript-додатків...", fullTextSource: '/assets/programming_typescript.txt', imageUrl: "/TypeScript.jpg", category: 'TypeScript' },
        { id: 2, title: "Angular: Up and Running", author: "Shyam Seshadri", excerpt: "Покроковий гід по створенню Angular-додатків...", fullTextSource: '/assets/angular_up_and_running.txt', imageUrl: "/angular.png", category: 'Angular' },
        { id: 3, title: "CSS Secrets", author: "Lea Verou", excerpt: "47 готових рішень для складних проблем веб-дизайну...", fullTextSource: '/assets/css_secrets.txt', imageUrl: "css.jfif", category: 'CSS/HTML' },
        { id: 4, title: "HTML and CSS: Design and Build Websites", author: "Jon Duckett", excerpt: "Візуальний гід по створенню веб-сайтів...", fullTextSource: '/assets/html_and_css_design.txt', imageUrl: "jond.jfif", category: 'CSS/HTML' }
    ];

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object 
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
        this.loadBooksFromStorage();
    }
    
    private loadBooksFromStorage(): void {
        if (!this.isBrowser) {
            this.booksSubject.next(this.initialBooks);
            return;
        }
        
        let books: Book[] = [...this.initialBooks];
        const storedBooks = localStorage.getItem(this.STORAGE_KEY);
        
        if (storedBooks) {
            const localData: Book[] = JSON.parse(storedBooks);
            const userAddedBooks = localData.filter(b => b.fullTextSource === 'local-memory');
    
            if (userAddedBooks.length > 0) {
                books.push(...userAddedBooks);
                const lastId = Math.max(...books.map(b => b.id));
                this.nextId = lastId + 1;
            }
        }
        
        this.booksSubject.next(books);
    }

    private saveBooksToStorage(books: Book[]): void {
        if (!this.isBrowser) {
            return;
        }
    
        const dataToStore = books
            .filter(book => book.fullTextSource === 'local-memory')
            .map(book => {
                const { fullText, ...rest } = book;
                return rest;
            });
        
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToStore));
    }

    getAllBooksAsync(): Observable<Book[]> {
        return this.booksSubject.asObservable();
    }

    getBookById(id: number): Book | undefined {
        return this.booksSubject.getValue().find(book => book.id === id);
    }

    addBookToMemory(newBookData: { title: string, author: string, excerpt: string, fullText: string, category: string, imageUrl?: string }): Promise<void> {
        return new Promise((resolve) => {
            const currentBooks = this.booksSubject.getValue();
            
            const newBook: Book = {
                id: this.nextId++,
                title: newBookData.title,
                author: newBookData.author,
                excerpt: newBookData.excerpt,
                fullText: newBookData.fullText, 
                fullTextSource: 'local-memory',
                category: newBookData.category,
                imageUrl: newBookData.imageUrl
            };
            
            const updatedBooks = [...currentBooks, newBook];
            this.booksSubject.next(updatedBooks);
            this.saveBooksToStorage(updatedBooks); 
            
            resolve();
        });
    }

    getBookFullText(bookId: number): Observable<string> {
        const book = this.booksSubject.getValue().find(b => b.id === bookId);
    
        if (!book) {
            return of('Книгу не знайдено.');
        }
        
        if (book.fullText) {
            return of(book.fullText);
        }
        
        if (book.fullTextSource && book.fullTextSource.endsWith('.txt')) {
            return this.http.get(book.fullTextSource, { responseType: 'text' }).pipe(
                map((text: string) => { 
                    book.fullText = text; 
                    return text;
                })
            );
        }
        
        return of('Помилка: Повний текст книги не завантажено.');
    }
    
    deleteBook(bookId: number): void {
        const currentBooks = this.booksSubject.getValue();
        const updatedBooks = currentBooks.filter(book => book.id !== bookId);
        
        if (updatedBooks.length < currentBooks.length) {
            this.booksSubject.next(updatedBooks);
            this.saveBooksToStorage(updatedBooks);
        }
    }
}