import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { devMicroserviceUrl } from "src/environments/environments";
import { ICuisine, ISearchResult } from "./model/search-filter.model";


@Injectable({
    providedIn: 'root'
})
export class SearchFilterService {
    baseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/"
    searchFilterUrl = devMicroserviceUrl.search_filter;

    constructor(private http : HttpClient) {}

    searchByOutletName(outletName: string, cuisine?: number): Observable<ISearchResult[]> {
        let params: HttpParams = new HttpParams().set("outletName", outletName);

        if (cuisine) {
            params = params.set("cuisine", cuisine);
        }

        return this.http.get<ISearchResult[]>(devMicroserviceUrl.search_filter + 'search-by-outlet-name', { params: params });
    }

    getAllCuisines(): Observable<ICuisine[]> {
        return this.http.get<ICuisine[]>(devMicroserviceUrl.search_filter + 'get-all-cuisines');
    }
}