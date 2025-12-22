import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  saveProgress(bookId: number | string, percent: number): void {
    // Перевіряємо, чи ми в браузері, перед тим як чіпати localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(`book_progress_${bookId}`, percent.toString());
    }
  }

  getProgress(bookId: number | string): number {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(`book_progress_${bookId}`);
      return data ? parseFloat(data) : 0;
    }
    return 0; // Якщо ми на сервері, повертаємо 0
  }
}
