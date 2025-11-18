import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';

import { PayloadMP } from '../../../models/payloadMP/payload-mp';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private apiUrl = 'http://localhost/neziara-sgbd/checkout/';
  private apiStartCheckout = `${this.apiUrl}salvarPedido.php`;
  private apiCreatePreference = `${this.apiUrl}criarPreferenciaMP.php`;
  private apiPerformCheckout = `${this.apiUrl}`;

  constructor(
    private http: HttpClient
  ) { }

  iniciaCheckout(payload: PayloadMP): Observable<PayloadMP> {
    return this.http.post<PayloadMP>(this.apiStartCheckout, payload);
  }

  chamarApiMercadoPago(idPedido: number): Observable<any> {
    return this.http.post<any>(this.apiCreatePreference, { idPedido: idPedido });
  }

  realizarCheckout(payload: PayloadMP): Observable<PayloadMP> {
    // Chama o salvarPedido.php
    return this.iniciaCheckout(payload).pipe(
      switchMap(response => {
          const idPedidoSalvo = response.idPedidoInterno; // Pega o ID da primeira resposta
          
          if (!idPedidoSalvo) {
              // Se o PHP não retornar o ID, lança um erro para parar a sequência
              throw new Error('ID do pedido não retornado pelo servidor.');
          }
          
          // Troca o observable: Agora chama o PHP que fala com o Mercado Pago
          return this.chamarApiMercadoPago(idPedidoSalvo);
      })
      // O resultado final (init_point, link, etc.) é retornado ao componente que chamou
  );
  }
}
