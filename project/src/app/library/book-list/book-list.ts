import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Book, BookService } from '../../services/book';
import { ProgressService } from '../../services/progress.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule]
})
export class BookListComponent implements OnInit {

  isModalOpen: boolean = false;
  isCustomCategory: boolean = false;

  availableImages: { url: string, name: string }[] = [
    { url: 'assets/images/typescript-book.jpg', name: 'TypeScript' },
    { url: 'assets/images/angular-book.jpg', name: 'Angular' },
    { url: 'assets/images/css-secrets.jpg', name: 'CSS Secrets' },
    { url: 'assets/images/html-css.jpg', name: 'HTML & CSS' },
    { url: 'assets/images/js-guide.jpg', name: 'JS Guide' },
    { url: '/photo/NoPhoto.jpg', name: 'No Photo'}
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

  constructor(
    public bookService: BookService,
    private progressService: ProgressService
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.bookService.getAllBooksAsync().subscribe({
      next: (books: Book[]) => {
        this.allBooks = books;

        const defaultCategories = this.bookService.categories;
        const bookCategories = this.allBooks
          .map(b => b.category)
          .filter(c => c && c.trim() !== '');
        const uniqueSet = new Set([...defaultCategories, ...bookCategories]);

        this.availableCategories = ['Усі Книги', ...Array.from(uniqueSet).filter(c => c !== 'Усі Книги')];
        this.filterBooks(this.selectedCategory);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Помилка завантаження книг:', err);
        this.isLoading = false;
      }
    });
  }
  getBookProgress(bookId: number): number {
    return this.progressService.getProgress(bookId);
  }

  openModal(): void {
    this.isCustomCategory = false;
    
    this.newBook = {
      title: '',
      author: '',
      excerpt: '',
      fullText: '',
      imageUrl: this.availableImages[0].url,
      category: this.availableCategories.length > 0 ? this.availableCategories[0] : ''
    };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  toggleCategoryMode(): void {
    this.isCustomCategory = !this.isCustomCategory;
    
    if (this.isCustomCategory) {
      this.newBook.category = ''; 
    } else {
      this.newBook.category = this.availableCategories[0] || '';
    }
  }

  confirmDelete(bookId: number, title: string): void {
    if (confirm(`Ви впевнені, що хочете видалити книгу "${title}"? Цю дію не можна скасувати.`)) {
      this.bookService.deleteBook(bookId);
      this.loadBooks();
    }
  }

  submitBook(): void {
    if (!this.newBook.fullText || this.newBook.fullText.trim().length < 50) {
      alert("Помилка: Текст книги обов'язковий і має бути не менше 50 символів для пагінації!");
      return;
    }

    if (!this.newBook.category || this.newBook.category.trim() === '') {
      alert("Будь ласка, вкажіть категорію!");
      return;
    }

    this.isLoading = true;

    if (this.isCustomCategory) {
      const newCat = this.newBook.category.trim();
      if (!this.bookService.categories.includes(newCat)) {
        this.bookService.categories.push(newCat);
      }
    }

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
        this.loadBooks(); 
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