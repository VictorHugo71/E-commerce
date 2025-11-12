import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PayloadMP } from '../../../models/payloadMP/payload-mp';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost/neziara-sgbd/checkout/';
  private apiStartCheckout = `${this.apiUrl}salvarPedido.php`;
  constructor(
    private http: HttpClient
  ) { }

  iniciaCheckout(payload: PayloadMP): Observable<PayloadMP> {
    return this.http.post<PayloadMP>(this.apiStartCheckout, payload);
  }
}
