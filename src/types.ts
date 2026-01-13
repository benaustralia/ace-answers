export interface Point {
    id: number;
    text: string;
}

export type Category = 'ANSWER' | 'CITE' | 'EXPLAIN';

export interface SortedPoint extends Point {
    category: Category;
    transition?: string;
}
