import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BusinessListing, BusinessListingDescription, BusinessListingDiscounts, BusinessListingSpecialConditions } from "./model/business-listing.model";


@Injectable({
    providedIn: 'root'
})
export class BusinessListingService {
    // baseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/"

    baseUrl = "http://localhost:8080/api/business-listing/"

    constructor(private http: HttpClient) { }

    getAllBusinessListings(): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'get-all-business-listings');
    }

    createBusinessListing(formData: FormData): Observable<any> {
        // return this.http.post<any>(`${this.baseUrl}create-business-listing`, formData,);
        return this.http.post<any>(this.baseUrl + 'create-business-listing', formData);
    }

    getBusinessListingDescriptionDetails(): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'get-business-listing-description-details');
    }

    createBusinessListingDescription(businessListingDescription: BusinessListingDescription): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'create-business-listing-description/', businessListingDescription);
    }

    createBusinessListingSpecialConditions(businessListingSpecialConditions: BusinessListingSpecialConditions): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'create-business-listing-special-conditions/', businessListingSpecialConditions);
    }

    createBusinessListingDiscounts(businessListingDiscounts: BusinessListingDiscounts[], params: HttpParams): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'create-business-listing-discounts/', businessListingDiscounts, { params });
    }

    getBusinessListing(params: HttpParams): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'get-business-listing', { params });
    }
}