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
  private apiSavePedido = `${this.apiUrl}salvarPedido.php`;
  private apiCreatePreference = `${this.apiUrl}criarPreferenciaMP.php`;
  private apiTestCheckout = `${this.apiUrl}simularPagamento.php`;

  constructor(
    private http: HttpClient
  ) { }

  salvarPedido(payload: PayloadMP): Observable<PayloadMP> {
    return this.http.post<PayloadMP>(this.apiSavePedido, payload);
  }

  chamarApiMercadoPago(idPedido: number): Observable<any> {
    return this.http.post<any>(this.apiCreatePreference, { idPedido: idPedido });
  }

  chamarApiTesteCheckout(idPedido: number, cartao: string): Observable<any> {
    const dadosCheckoutTeste = {
      idPedido: idPedido,
      numero_cartao: cartao
    }
    return this.http.post<any>(this.apiTestCheckout, dadosCheckoutTeste);
  }

  realizarCheckout(payload: PayloadMP): Observable<PayloadMP> {
    // Chama o salvarPedido.php
    return this.salvarPedido(payload).pipe(
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
          //Verifica o payload, se precisar cria um outro específico para teste
  realizarCheckoutTeste(payload: PayloadMP, numeroCartao: string): Observable<PayloadMP> {
    // Chama o salvarPedido.php
    return this.salvarPedido(payload).pipe(
      switchMap(response => {
          const idPedidoSalvo = response.idPedidoInterno; // Pega o ID da primeira resposta
          
          if (!idPedidoSalvo) {
              // Se o PHP não retornar o ID, lança um erro para parar a sequência
              throw new Error('ID do pedido não retornado pelo servidor.');
          }
          
          // Troca o observable: Agora chama o PHP de teste de checkout
          return this.chamarApiTesteCheckout(idPedidoSalvo, numeroCartao);
      })
    );
  }
}
