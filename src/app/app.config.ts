import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BooksService } from './services/books.service';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), { provide: BooksService, useClass: BooksService },
  provideRouter(routes),
  provideHttpClient(),
  ]
};
