import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Observable, map, of } from 'rxjs'; 

export interface Book {
    id: number;
    title: string;
    author: string;
    excerpt: string;
    // URL до файлу .txt
    fullTextSource: string; 
    fullText?: string; 
    imageUrl?: string;
    category: string;
}

@Injectable({
    providedIn: 'root'
})
export class BookService {
    
    public readonly categories: string[] = [
        'Усі Книги',
        'TypeScript',
        'Angular',
        'CSS/HTML'
    ];

    private books: Book[] = [
        {
            id: 1,
            title: "Programming TypeScript",
            author: "Boris Cherny",
            excerpt: "Масштабування JavaScript-додатків. Все про типи, компілятор та екосистему.",
            // ✅ ШЛЯХ ДО PUBLIC FOLDER (Абсолютний шлях)
            fullTextSource: '/assets/programming_typescript.txt', 
            imageUrl: "/TypeScript.jpg",
            category: 'TypeScript'
        },
        {
            id: 2,
            title: "Angular: Up and Running",
            author: "Shyam Seshadri",
            excerpt: "Покроковий гід по створенню Angular-додатків. Від Hello World до деплою.",
            fullTextSource: '/assets/angular_up_and_running.txt',
            imageUrl: "/angular.png",
            category: 'Angular'
        },
        {
            id: 3,
            title: "CSS Secrets",
            author: "Lea Verou",
            excerpt: "47 готових рішень для складних проблем веб-дизайну. Магія CSS у дії.",
            fullTextSource: '/assets/css_secrets.txt',
            imageUrl: "/css.jfif",
            category: 'CSS/HTML'

        },
        {
            id: 4,
            title: "HTML and CSS: Design and Build Websites",
            author: "Jon Duckett",
            excerpt: "Візуальний гід по створенню веб-сайтів. Бестселер, який змінив підхід до навчання.",
            fullTextSource: '/assets/html_and_css_design.txt',
            imageUrl: "/jond.jfif",
            category: 'CSS/HTML'
        }
    ];

    constructor(private http: HttpClient) { } 

    getAllBooks(): Book[] {
        return this.books;
    }

    getBookById(id: number): Book | undefined {
        return this.books.find(book => book.id === id);
    }

    getBookFullText(bookId: number): Observable<string> {
        const book = this.books.find(b => b.id === bookId);
        if (!book) { return new Observable(observer => observer.error('Книгу не знайдено')); }
        if (book.fullText) { return of(book.fullText); }
        
        // 2. HTTP-запит до файлу .txt
        return this.http.get(book.fullTextSource, { responseType: 'text' }).pipe(
            map(text => {
                book.fullText = text; 
                return text;
            })
        );
    }
}