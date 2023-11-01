import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { devMicroserviceUrl, prodMicroserviceUrl } from "src/environments/environments";
import { ICuisine, IDiscount, ISearchListing, ISearchListingsPageable, ISearchListingsRequest, ISearchResult } from "./model/search-filter.model";
import { IPageableResponseBody } from "../model/pageable-response.model";
import { createTableQueryHttpParam } from "../util/http-param-utility";

const searchFilterUrl = devMicroserviceUrl.search_filter;

@Injectable({
    providedIn: 'root'
})
export class SearchFilterService {
    baseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/"
    
    constructor(private http : HttpClient) {}

    searchByOutletName(outletName: string, cuisine?: number): Observable<ISearchResult[]> {
        let params: HttpParams = new HttpParams().set("outletName", outletName);

        if (cuisine) {
            params = params.set("cuisine", cuisine);
        }

        return this.http.get<ISearchResult[]>(searchFilterUrl + 'search-by-outlet-name', { params: params });
    }

    getAllCuisines(): Observable<ICuisine[]> {
        return this.http.get<ICuisine[]>(searchFilterUrl + 'get-all-cuisines');
    }

    getAllDiscounts(): Observable<IDiscount[]> {
        return this.http.get<IDiscount[]>(searchFilterUrl + 'get-all-discounts');
    }

    searchListings(searchListingsPageable: ISearchListingsPageable): Observable<IPageableResponseBody<ISearchListing>> {
        return this.http.post<IPageableResponseBody<ISearchListing>>(searchFilterUrl + 'search-listings', searchListingsPageable.search , { params: createTableQueryHttpParam(searchListingsPageable.pageable) });
    }
}