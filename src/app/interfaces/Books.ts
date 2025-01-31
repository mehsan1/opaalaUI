export interface BooksResponse {
    count: number;
    next: string;
    previous: string;
    results: Books[]
}

export interface Books {
    id: number;
    title: string;
    year: string;
    name: string;
    list_id?: number;
}