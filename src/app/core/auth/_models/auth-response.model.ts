export interface ApiResponse<T> {
  response: {
    status: string;
    message: string;
    code: number;
    errors: string[] | Record<string, string[]>;
  };
  data: T;
}