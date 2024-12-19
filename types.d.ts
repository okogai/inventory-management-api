export interface IPostFromDb {
    message: string;
    author: string;
    image: string | null;
    date: string;
    id: string;
}

export interface IPost {
    message: string;
    author: string;
    image: string | null;
}
