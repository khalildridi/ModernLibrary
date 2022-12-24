import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Purchase } from '../models/purchase.model';
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
export class CheckOutRestService {
  constructor(private http: HttpClient) {}

  registerPurchase(email: string, purchase: Purchase): Observable<any> {
    return this.http.put<Purchase>(
      endpoint + 'users/registerPurchase/' + email,
      JSON.stringify(purchase),
      httpOptions
    );
  }
}
