import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost/neziara-sgbd/carrinho/';
  private apiAddPedido = `${this.apiUrl}`;
  constructor(
    private http: HttpClient
  ) { }

  addPedido() {

  }

  criaPagamento() {
    
  }
}
