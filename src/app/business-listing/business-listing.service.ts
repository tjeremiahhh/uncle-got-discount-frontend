import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BusinessListing, BusinessListingDescription, BusinessListingDiscounts, BusinessListingRequest, BusinessListingSpecialConditions, Reservation } from "./model/business-listing.model";


@Injectable({
    providedIn: 'root'
})
export class BusinessListingService {
    businessListingBaseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/"
    reservationBaseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/reservation/"

    // businessListingBaseUrl = "http://localhost:8080/api/business-listing/"

    // reservationBaseUrl = "http://localhost:8080/api/reservation/"

    constructor(private http: HttpClient) { }

    getAllBusinessListings(): Observable<any> {
        return this.http.get<any>(this.businessListingBaseUrl + 'get-all-business-listings');
    }

    createBusinessListing(businessListingRequest: BusinessListingRequest): Observable<any> {
        // return this.http.post<any>(`${this.businessListingBaseUrl}create-business-listing`, formData,);
        return this.http.post<any>(this.businessListingBaseUrl + 'create-business-listing', businessListingRequest);
    }

    getBusinessListingDescriptionDetails(): Observable<any> {
        return this.http.get<any>(this.businessListingBaseUrl + 'get-business-listing-description-details');
    }

    createBusinessListingDescription(businessListingDescription: BusinessListingDescription): Observable<any> {
        return this.http.post<any>(this.businessListingBaseUrl + 'create-business-listing-description', businessListingDescription);
    }

    createBusinessListingSpecialConditions(businessListingSpecialConditions: BusinessListingSpecialConditions): Observable<any> {
        return this.http.post<any>(this.businessListingBaseUrl + 'create-business-listing-special-conditions', businessListingSpecialConditions);
    }

    createBusinessListingDiscounts(businessListingDiscounts: BusinessListingDiscounts[], params: HttpParams): Observable<any> {
        return this.http.post<any>(this.businessListingBaseUrl + 'create-business-listing-discounts', businessListingDiscounts, { params });
    }

    getBusinessListing(params: HttpParams): Observable<any> {
        return this.http.get<any>(this.businessListingBaseUrl + 'get-business-listing', { params });
    }

    createNewReservation(reservation: Reservation): Observable<any> {
        return this.http.post<any>(this.reservationBaseUrl + 'create-new-reservation', reservation);
    }
}