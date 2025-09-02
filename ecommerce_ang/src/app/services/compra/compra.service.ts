import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { AdminResponse } from '../../models/admin/admin-response';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost/neziara-sgbd/';
  private apiAddFinalizar = `${this.apiUrl}`;
  private apiGetFinalizar = `${this.apiUrl}`;
  private apiRemoveFinalizar = `${this.apiUrl}`;

  constructor(
    private http: HttpClient
  ) { }

  addFinalizarCompra(idProduto: number, idCliente: number, quantidade: number): Observable<AdminResponse> {
    const dados = {
      Id_Produto: idProduto,
      Id_Cliente: idCliente,
      Quantidade: quantidade
    };

    return this.http.post<AdminResponse>(this.apiAddFinalizar, dados);
  }

  getFinalizarCompra() {

  }

  addSelecionadosFinalizar() {

  }
  
  removeFinalizarCompra() {

  }

}
