import { Item } from './item.model';

export class Purchase {
  _id?: any;
  date?: Date;
  discount?: number;
  totalPrice?: number;
  books?: Item[];
}
