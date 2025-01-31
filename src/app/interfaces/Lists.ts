export interface ListsResponse {
    count: number;
    next: string;
    previous: string;
    results: Lists[]
}

export interface Lists {
    id: number;
    title: string;
}