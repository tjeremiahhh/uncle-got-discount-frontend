import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegisterRequest } from "./model/register.model";


@Injectable({
    providedIn: 'root'
})
export class RegisterService {
    baseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/authentication/"

    constructor(private http : HttpClient) {}

    register(registerRequest : RegisterRequest): Observable<any> {
        return this.http.post<any>(this.baseUrl + 'register/', registerRequest);
    }
}