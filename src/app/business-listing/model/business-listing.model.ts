export class BusinessListing {
    id?: number;
    userId?: number;
    outletName?: string;
    emailAddress?: string;
    phoneNumber?: number;
    address?: string;
    imageFile?: Blob;
    websiteUrl?: string;
    allowPublicHoliday?: boolean;
    menuUrl?: string;
    halalCertified?: boolean;
}

export class BusinessListingDescription {
    id?: number
    businessListingId?: number
    about?: string;
    cuisines?: string;
    atmospheres?: string;
    languages?: string;
    paymentOptions?: string;
}

export interface Cuisines {
    id: number;
    cuisine: string;
}

export interface Days {
    id: number;
    day: string;
}

export interface Discounts {
    id: number;
    discount: number;
}

export interface PaymentOptions {
    id: number;
    paymentOption: string;
}

export interface Timings {
    id: number;
    time: string;
}

export interface Atmospheres {
    id: number;
    atmosphere: string;
}

export class BusinessListingSpecialConditions {
    id?: number;
    businessListingId?: number;
    condition?: string;
}

export class BusinessListingDiscounts {
    id?: number;
    businessListingId?: number;
    dayId?: number;
    timingsId?: number;
    discountsId?: number;
    maxHeadCount?: number;
    time?: string;
    discountInPercent?: number;
    day?: Days;
}

export class BusinessListingRequest {
    businessListing?: BusinessListing;
    businessListingDescription?: BusinessListingDescription;
    businessListingSpecialConditions?: BusinessListingSpecialConditions;
    businessListingDiscounts?: BusinessListingDiscounts[];
}