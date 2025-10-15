import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { Book, BookService } from '../../services/book'; 

@Component({
  selector: 'app-reader',
  templateUrl: './reader.html', 
  styleUrls: ['./reader.css'],
  standalone: true, 
  imports: [CommonModule, RouterLink] 
})
export class ReaderComponent implements OnInit {
  
  bookId: number | undefined;
  currentBook: Book | undefined;
  
  pages: string[] = []; 
  currentPageIndex: number = 0; 
  pageContent: string = ''; 
  
  private readonly PAGE_SIZE = 1500; 

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        this.bookId = +idParam; 
        this.currentBook = this.bookService.getBookById(this.bookId);
        
        if (this.currentBook) {
          this.paginateText(this.currentBook.fullText);
          this.updatePageContent();
        }
      }
    });
  }

  private paginateText(fullText: string): void {
    this.pages = [];
    if (!fullText) return;

    for (let i = 0; i < fullText.length; i += this.PAGE_SIZE) {
      const page = fullText.substring(i, i + this.PAGE_SIZE);
      this.pages.push(page);
    }
  }

  private updatePageContent(): void {
    if (this.pages.length > 0) {
      this.pageContent = this.pages[this.currentPageIndex];
    } else {
      this.pageContent = 'Текст книги відсутній.';
    }
  }

  goToNextPage(): void {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.currentPageIndex++;
      this.updatePageContent();
    }
  }

  goToPrevPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.updatePageContent();
    }
  }
  
  isFirstPage(): boolean {
    return this.currentPageIndex === 0;
  }
  
  isLastPage(): boolean {
    return this.currentPageIndex === this.pages.length - 1;
  }
}