export interface BusinessListing {
    id ?: number;
    userId ?: number;
    outletName ?: string;
    emailAddress ?: string;
    phoneNumber ?: number;
    address ?: string;
    imageFile ?: Blob;
    websiteUrl ?: string;
    allowPublicHoliday ?: boolean;
    menuUrl ?: string;
    halalCertified ?: boolean;
}

export interface ISearchResult {
    id ?: number;
    outletName ?: string;
    address ?: string;
    imageFile ?: Uint8Array;
}