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

export interface IDiscount {
    id: number;
    discount: number;
}

export interface ICheckOption {
    label?: string;
    value?: number;
    checked?: boolean;
}

export class CheckOption {
    constructor(
        public label ?: string,
        public value ?: number,
        public checked ?: boolean
    ){}
}

export interface IBusinessListingDiscount {
    dayId?: number;
    day: string;
    timingsId?: number;
    time: string;
    discountId?: number;
    discount?: number;
}

export interface ISearchListing extends ISearchResult {
    discountList?: IBusinessListingDiscount[];
}

export interface ISearchListingsRequest {
    outletName?: string;
    cuisineList?: (number | undefined)[];
    minDiscount?: number;
    maxDiscount?: number;
}

export class SearchListingsRequest implements ISearchListingsRequest {
    constructor(
        public outletName?: string,
        public cuisineList?: (number | undefined)[],
        public minDiscount?: number,
        public maxDiscount?: number
    ){}
}