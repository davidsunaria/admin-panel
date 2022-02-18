export interface IPayload {
  url: string;
  payload?: string | object;
}

export interface IPagination {
  currentPage?: number | string;
  limit?: number | string;
  nextPage?: number | string;
  pages?: number | string;
  prevPage?: number | string;
  total?: number | string;
}