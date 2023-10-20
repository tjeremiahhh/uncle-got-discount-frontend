import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AuthenticationRequest, User, JwtToken } from "./model/authenticate.model";
import { catchError, tap } from "rxjs";
import jwt_decode from 'jwt-decode';
import { NzModalService } from "ng-zorro-antd/modal";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser$: Observable<any>;
    private currentTokenSubject: BehaviorSubject<any>;
    public currentToken$: Observable<any>;
    private httpClient: HttpClient;

    baseUrl = "https://gew0xe9lag.execute-api.ap-southeast-1.amazonaws.com/api/authentication/"

    constructor(
        private http : HttpClient,
        private handler : HttpBackend,
        private modal : NzModalService
    ) {
        this.httpClient = new HttpClient(handler);

        this.currentTokenSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentToken') || '{}'));
        this.currentToken$ = this.currentTokenSubject.asObservable();

        this.currentUserSubject = new BehaviorSubject<any>(Object.keys(this.currentToken).length != 0 ? jwt_decode<User>(this.currentToken) : null);
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentToken(): any {
        return this.currentTokenSubject.value;
    }

    public get currentUser(): any {
        return this.currentUserSubject.value;
    }

    authenticate(authenticationRequest : AuthenticationRequest): Observable<any> {
        // return this.http.post<any>(this.baseUrl + 'authenticate/', authenticationRequest);
        
        return this.http.post<any>(this.baseUrl + 'authenticate/', authenticationRequest)
            .pipe(
                tap((res: JwtToken) => {
                    this.setSessionExpired(false);
                    this.setUserData(res.token);
                }),
                catchError(error => {
                    this.clearUserData();
                    return throwError(() => error);
                })
            )
    }
    
    setUserData(jwtToken?: string) {
        if (jwtToken) {
            localStorage.setItem('currentToken', JSON.stringify(jwtToken));
        }
        const token = jwtToken ?? JSON.parse(localStorage.getItem('currentToken') || '{}');
        const decodedToken: User = jwt_decode<User>(token);
        this.currentTokenSubject.next(token);
        this.currentUserSubject.next(decodedToken);
    }

    clearUserData() {
        localStorage.clear();
        this.currentTokenSubject.next(null);
        this.currentUserSubject.next(null);
    }

    getSessionExpired() {
        return localStorage.getItem('sessionExpired') ? JSON.parse(localStorage.getItem('sessionExpired') || '{}') : true;
    }

    setSessionExpired(expired: boolean) {
        localStorage.setItem('sessionExpired', JSON.stringify(expired));
        if (expired) {
            this.clearUserData();
        }
    }

    logOut() {
        this.clearUserData();
        this.modal.closeAll();
    }
}