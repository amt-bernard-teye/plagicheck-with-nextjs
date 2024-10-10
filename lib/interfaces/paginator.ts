export interface IPaginator<Type>{
  paginate: (value: string, page: number) => Promise<Type[]>;
  count: (value: string) => Promise<number>;
}