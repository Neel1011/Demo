import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
   }

   signup(userData: any): Observable<any> {
    return this.http.post(`${environment.apiAuth}signup`, userData)
  }

  otpVerification(email : any): Observable<any>{
    return this.http.put(`${environment.apiAuth}verify-otp`, email) 
  }

  register(userData: any): Observable<any> {
    return this.http.put(`${environment.apiAuth}complete-registration`, userData)
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${environment.apiAuth}login`, userData);
  }
}