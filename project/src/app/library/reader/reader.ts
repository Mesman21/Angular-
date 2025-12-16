import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostBinding, ChangeDetectorRef } from '@angular/core'; 
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { Book, BookService } from '../../services/book'; 
import { Subscription } from 'rxjs'; 

@Component({
    selector: 'app-reader',
    templateUrl: './reader.html', 
    styleUrls: ['./reader.css'],
    standalone: true, 
    imports: [CommonModule, RouterLink]
})
export class ReaderComponent implements OnInit, OnDestroy { 
    
    private readonly STORAGE_KEY_PREFIX = 'book_progress_';
    private routeSubscription!: Subscription; 
    
    bookId: number | undefined;
    currentBook: Book | undefined;
    
    pages: string[] = []; 
    currentPageIndex: number = 0; 
    pageContent: string = 'Завантаження тексту...'; 
    
    private readonly PAGE_SIZE = 750;
    
    isDarkTheme = false;
    currentTime = new Date();
    
    @HostBinding('class.dark-theme') get themeMode() {
        return this.isDarkTheme;
    }

    constructor(
        private route: ActivatedRoute,
        private bookService: BookService,
        @Inject(PLATFORM_ID) private platformId: Object,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            const idParam = params.get('id');
        
            if (idParam) { 
                const bookId = Number(idParam); 
                this.bookId = bookId;
                this.currentBook = this.bookService.getBookById(bookId);

                if (this.currentBook) {
                    this.bookService.getBookFullText(bookId).subscribe({
                        next: (fullText) => {
                            this.paginateText(fullText); 
                            this.loadProgress(); 
                            this.updatePageContent();
                        },
                        error: (err) => {
                            console.error("Помилка завантаження тексту книги:", err)
                            this.pageContent = 'Помилка: Не вдалося завантажити повний текст книги. Перевірте файл .txt.';
                        }
                    });
                } else {
                    this.pageContent = 'Книгу не знайдено.';
                }

            } else {
                this.pageContent = 'Помилка: Необхідний ідентифікатор книги.';
            }
        });
        
        if (isPlatformBrowser(this.platformId)) {
            this.loadTheme();
            setInterval(() => {
                this.currentTime = new Date();
                this.cdr.detectChanges();
            }, 1000);
        }
    }
    
    ngOnDestroy(): void {
        this.saveProgress();
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    toggleTheme() {
        if (isPlatformBrowser(this.platformId)) {
            this.isDarkTheme = !this.isDarkTheme;
            this.saveTheme();
            
            const body = document.body;
            if (this.isDarkTheme) {
                body.style.backgroundColor = '#1e1e1e'; 
            } else {
                body.style.backgroundColor = '#ffffff'; 
            }
        }
    }
    
    private saveTheme(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
        }
    }

    private loadTheme(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            this.isDarkTheme = true;
            document.body.style.backgroundColor = '#1e1e1e';
        } else if (savedTheme === 'light') {
            this.isDarkTheme = false;
            document.body.style.backgroundColor = '#ffffff';
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDarkTheme = true; 
            document.body.style.backgroundColor = '#1e1e1e';
        }
    }

    saveProgress(): void {
        if (isPlatformBrowser(this.platformId) && this.bookId !== undefined) {
            localStorage.setItem(this.STORAGE_KEY_PREFIX + this.bookId, this.currentPageIndex.toString());
        }
    }

    loadProgress(): void {
        if (isPlatformBrowser(this.platformId) && this.bookId !== undefined) {
            const savedIndex = localStorage.getItem(this.STORAGE_KEY_PREFIX + this.bookId);
            
            if (savedIndex !== null) {
                const index = parseInt(savedIndex, 10);
                
                if (!isNaN(index) && index >= 0 && index < this.pages.length) {
                    this.currentPageIndex = index;
                }
            }
        }
    }

    goToNextPage(): void {
        if (this.currentPageIndex < this.pages.length - 1) {
            this.currentPageIndex++;
            this.updatePageContent();
            this.saveProgress();
        }
    }

    goToPrevPage(): void {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.updatePageContent();
            this.saveProgress();
        }
        
    }

    private updatePageContent(): void {
        if (this.pages.length > 0) {
            this.pageContent = this.formatPageText(this.pages[this.currentPageIndex]);
        } else {
            this.pageContent = 'Текст книги відсутній або виникла помилка пагінації.';
        }
    }
    
    public formatPageText(text: string): string {
        if (!text) return '';
        
        let formattedText = text.replace(/(\r\n|\n|\r){2}/g, '</p><p>'); 

        formattedText = '<p>' + formattedText + '</p>';
        
        formattedText = formattedText.replace(/(\r\n|\n|\r)/g, ' ');

        return formattedText;
    }
    
    private paginateText(fullText: string): void {
        this.pages = [];
        let cleanText = fullText.trim(); 
        
        if (!cleanText) return; 

        let currentPosition = 0;
        while (currentPosition < cleanText.length) {
            let endPosition = currentPosition + this.PAGE_SIZE;
            
            if (endPosition >= cleanText.length) {
                endPosition = cleanText.length;
            } else {
                let searchArea = cleanText.substring(currentPosition, endPosition);
                let lastSeparatorIndex = searchArea.search(/[\s.,;:]+[^.,;:]*$/);
                
                if (lastSeparatorIndex !== -1) {
                    endPosition = currentPosition + lastSeparatorIndex + 1;
                }
            }

            const page = cleanText.substring(currentPosition, endPosition).trim();
            
            if (page.length > 0) {
                this.pages.push(page);
            }
            
            while (currentPosition < cleanText.length && /\s/.test(cleanText[currentPosition])) {
                currentPosition++;
            }
        }
    }
    
    get totalPages(): number {
        return this.pages.length;
    }

    isFirstPage(): boolean {
        return this.currentPageIndex === 0;
    }

    isLastPage(): boolean {
        return this.currentPageIndex === this.pages.length - 1;
    }
}