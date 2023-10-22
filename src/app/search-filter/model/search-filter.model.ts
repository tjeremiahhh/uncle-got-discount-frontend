export interface ISearchResult {
    id ?: number;
    outletName ?: string;
    address ?: string;
    imageFile ?: Uint8Array;
}

export interface ICuisine {
    id: number;
    cuisine: string;
}