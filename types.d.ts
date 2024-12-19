export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Item {
    id: number;
    name: string;
    category_id: number;
    location_id: number;
    description: string;
    image: string;
    date_added: string;
}
