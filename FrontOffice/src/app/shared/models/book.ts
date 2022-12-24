import { Review } from 'src/app/modules/books/books-list/models/review.model';

export class Book {
  _id?: string;
  title?: string;
  synopsis?: string;
  author?: string;
  ISBN?: string;
  editor?: string;
  genre?: string;
  launch_date?: Date;
  cover?: string;
  new?: number;
  worn?: number;
  number_of_pages?: number;
  price?: number;
  reviews?: Review[];
}
