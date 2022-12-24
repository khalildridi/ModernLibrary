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
export class LoyaltySystemService {
  constructor(private http: HttpClient) {}

  getLoyaltyConditions(): Observable<any> {
    return this.http.get<any>(endpoint + 'loyaltyConditions/', httpOptions);
  }
}
