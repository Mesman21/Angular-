import { Component, OnInit, OnDestroy, HostBinding, NgZone, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  isDarkTheme = false;
  currentTime = new Date();
  private timerId: any;

  @HostBinding('class.dark-theme') get themeMode() {
    return this.isDarkTheme;
  }

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.timerId = setInterval(() => {
        this.ngZone.run(() => {
          this.currentTime = new Date();
          this.cdr.detectChanges();
        });
      }, 1000);
    });
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    const body = document.body;
    if (this.isDarkTheme) {
      body.classList.add('dark-theme');
      body.style.backgroundColor = '#1e1e1e';
    } else {
      body.classList.remove('dark-theme');
      body.style.backgroundColor = '#ffffff';
    }
  }
}
