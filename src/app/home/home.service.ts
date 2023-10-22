import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BusinessListing, ISearchResult } from "./model/home.model";
import { devMicroserviceUrl, prodMicroserviceUrl } from "src/environments/environments";

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    businessListingUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/";
    searchFilterUrl = "http://localhost:8080/api/search-filter/";

    constructor(private http : HttpClient) {}

    getAllBusinessListings(): Observable<any> {
        return this.http.get<any>(prodMicroserviceUrl.business_listing + 'get-all-business-listings');
    }

    searchByOutletName(outletName: string): Observable<ISearchResult[]> {
        let params: HttpParams = new HttpParams().set("outletName", outletName);

        return this.http.get<ISearchResult[]>(devMicroserviceUrl.search_filter + 'search-by-outlet-name', { params: params });
    }

    getBusinessListingDescriptionDetails(): Observable<any> {
        return this.http.get<any>(this.businessListingUrl + 'get-business-listing-description-details');
    }
}