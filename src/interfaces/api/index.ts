export interface IPayload {
  url: string;
  payload?: any;
}

export interface IPagination {
  currentPage?: number | string;
  limit?: number | string;
  nextPage?: number | string;
  pages?: number | string;
  prevPage?: number | string;
  total?: number | string;
}