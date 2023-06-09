export type IPagination<T> = {
  total: number;
  perPage: number;
  page: number;
  lastPage: number;
  data: T[];
  message: string[];
};
