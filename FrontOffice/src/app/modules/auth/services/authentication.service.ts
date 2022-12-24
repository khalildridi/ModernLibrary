import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const endpoint = 'http://localhost:3000/api/v1/auth/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      endpoint + 'login',
      JSON.stringify({ email, password }),
      httpOptions
    );
  }

  register(
    name: string,
    email: string,
    password: string,
    contact: number,
    birth_date: Date
  ): Observable<any> {
    return this.http.post<any>(endpoint + 'register', {
      name,
      email,
      password,
      contact,
      birth_date,
    });
  }
}
