import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// 💡 ІМПОРТУЄМО provideHttpClient ТА withFetch
import { provideHttpClient, withFetch } from '@angular/common/http'; 

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    // ✅ ДОДАНО: Реєструємо HttpClient з withFetch
    provideHttpClient(withFetch()) 
  ]
};