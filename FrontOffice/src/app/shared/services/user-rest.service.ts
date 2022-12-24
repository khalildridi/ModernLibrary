import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const endpoint = 'http://localhost:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-access-token': 'Bearer ' + localStorage.getItem('currentUser'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class UserRestService {
  constructor(private http: HttpClient) {}

  getId(): Observable<any> {
    return this.http.post<any>(endpoint + 'auth/getId', httpOptions);
  }

  save(
    id: string,
    name: string,
    email: string,
    contact?: number,
    street?: string,
    city?: string,
    district?: string,
    zipCode?: string
  ): Observable<any> {
    return this.http.put<any>(endpoint + 'users/edit/' + id, {
      name,
      email,
      contact,
      street,
      city,
      district,
      zipCode,
      httpOptions,
    });
  }
}
