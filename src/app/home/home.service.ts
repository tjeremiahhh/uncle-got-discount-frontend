import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BusinessListing } from "./model/home.model";


@Injectable({
    providedIn: 'root'
})
export class HomeService {
    baseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/"

    constructor(private http : HttpClient) {}

    getAllBusinessListings(): Observable<any> {
        return this.http.get<any>(this.baseUrl + 'get-all-business-listings');
    }
}