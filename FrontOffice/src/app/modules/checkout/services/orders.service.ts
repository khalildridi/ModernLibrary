import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

const endpoint = 'http://localhost:3000/api/v1/orders/';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getOrderDetail(id: string): Observable<any> {
    return this.http.get(`${endpoint}${id}`);
  }

  sendPayment(token: string, email: string, amount: number): Promise<any> {
    return this.http
      .patch(`${endpoint}${email}`, {
        token,
        amount,
      })
      .toPromise();
  }

  generateOrder(data: { name: string; amount: number }): Observable<any> {
    return this.http.post(endpoint, data);
  }

  confirmOrder(id: string): Promise<any> {
    return this.http.patch(`${endpoint}confirm/${id}`, {}).toPromise();
  }
}
