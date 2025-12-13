import { Component, Inject, PLATFORM_ID, HostBinding, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isDarkTheme = false;
  currentTime = new Date();

  @HostBinding('class.dark-theme') get themeMode() {
    return this.isDarkTheme;
  }

  // Додаємо ChangeDetectorRef у конструктор
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.currentTime = new Date();

        this.cdr.detectChanges();

      }, 1000);
    }
  }

  toggleTheme() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkTheme = !this.isDarkTheme;

      const body = document.body;
      if (this.isDarkTheme) {
        body.style.backgroundColor = '#000000';
      } else {
        body.style.backgroundColor = '#ffffff';
      }
    }
  }
}
