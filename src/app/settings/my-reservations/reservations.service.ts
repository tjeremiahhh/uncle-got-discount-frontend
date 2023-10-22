import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReservationsService {
  businessListingBaseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/business-listing/"
  reservationBaseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/reservation/"
  // reservationBaseUrl = "http://localhost:8080/api/reservation/"

  constructor(private http: HttpClient) { }

  getAllUpcomingReservations(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.reservationBaseUrl + 'get-upcoming-reservations', { params });
  }

  getAllHistoricalReservations(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.reservationBaseUrl + 'get-historical-reservations', { params });
  }

  getBusinessListingAndDiscount(params: HttpParams): Observable<any> {
    return this.http.get<any>(this.businessListingBaseUrl + 'get-business-listing-and-discount', { params });
  }

}
