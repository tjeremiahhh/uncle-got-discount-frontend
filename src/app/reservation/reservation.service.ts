import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reservation } from "./model/reservation.model";


@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    reservationBaseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/reservation/"

    // reservationBaseUrl = "http://localhost:8080/api/reservation/"

    constructor(private http: HttpClient) { }

    getReservation(params: HttpParams): Observable<any> {
        return this.http.get<any>(this.reservationBaseUrl + 'get-reservation', { params });
    }

    editReservation(reservation: Reservation): Observable<any> {
        return this.http.post<any>(this.reservationBaseUrl + 'edit-reservation', reservation);
    }

    deleteReservation(params: HttpParams): Observable<any> {
        return this.http.post<any>(this.reservationBaseUrl + 'delete-reservation', {}, { params });
    }
}