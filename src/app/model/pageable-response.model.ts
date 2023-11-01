export interface ISort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface IPageable {
    sort: ISort;
    pageNumber: number;
    pageSize: number;
}

export interface IPageableResponseBody<T> {
    content: T[];
    pageable: IPageable;
    totalElements: number;
    totalPages: number;
    sort: ISort;
    size: number;
    empty: boolean;
    first: boolean
    last: boolean;
    numberOfElements: number;
    number: number;
}