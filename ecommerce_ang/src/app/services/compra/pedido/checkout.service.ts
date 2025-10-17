import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { PayloadMP } from '../../../models/payloadMP/payload-mp';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost/neziara-sgbd/carrinho/';
  private apiAddPedido = `${this.apiUrl}`;
  constructor(
    private http: HttpClient
  ) { }

 
}
