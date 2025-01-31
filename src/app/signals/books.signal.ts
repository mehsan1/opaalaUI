import { signal } from '@angular/core'
import { Books } from '../interfaces/Books';
export const books = signal<Books[]>([]);