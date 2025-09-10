import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { AdminResponse } from '../../models/admin/admin-response';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost/neziara-sgbd/carrinho/';
  private apiAddCarrinho = `${this.apiUrl}addCarrinho.php`;
  private apiGetCarrinho = `${this.apiUrl}getCarrinho.php`;
  private apiRemoveCarrinho = `${this.apiUrl}removeCarrinho.php`;

  constructor(
    private http: HttpClient
  ) { }

  addCarrinho(idProduto: number, idCliente: number, quantidade: number): Observable<AdminResponse> {
    const dados = {
      Id_Produto: idProduto,
      Id_Cliente: idCliente,
      Quantidade: quantidade
    };

    return this.http.post<AdminResponse>(this.apiAddCarrinho, dados);
  }

  getCarrinho(Id_Cliente: number): Observable<AdminProdutos[]> {
    return this.http.get<AdminProdutos[]>(`${this.apiGetCarrinho}?Id_Cliente=${Id_Cliente}`);
  }

  addSelecionadosCarrinho() {

  }
  
  removeCarrinho(Id_Produto: number, Id_Cliente: number): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>(`${this.apiRemoveCarrinho}?Id_Produto=${Id_Produto}&Id_Cliente=${Id_Cliente}`);
  }

}
