export class SearchBookOptions {
  searchContent: string = '';
  minPrice?: number = 0;
  maxPrice?: number = 300;
  page: number = 1;
  hasNextPage?: boolean = false;
  priceSort?: string = 'asc';
}
