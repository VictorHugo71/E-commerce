import { Injectable } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminResponse } from '../../models/admin/admin-response';

@Injectable({
  providedIn: 'root'
})
export class DesejoService {
  private apiUrl = 'http://localhost/neziara-sgbd/admin/lista-desejo/';
  private apiAddLista = `${this.apiUrl}addListaDesejo.php`;
  private apiRemoveLista = `${this.apiUrl}removeListaDesejo.php`;
  private apiGetLista = `${this.apiUrl}getListaDesejo.php`;
  private apiRemoveSelecionadosLista = `${this.apiUrl}removeSelecionadosListaDesejo.php`;

  constructor(
    private http: HttpClient
  ) { }
  
  addListaDesejo(idProduto: number, idCliente: number): Observable<AdminResponse> {
    const dados = {
      Id_Produto: idProduto,
      Id_Cliente: idCliente
    };

    return this.http.post<AdminResponse>(this.apiAddLista, dados);
  }

  getListaDesejo(Id_Cliente: number): Observable<AdminProdutos[]> {
    return this.http.get<AdminProdutos[]>(`${this.apiGetLista}/${Id_Cliente}`);  
  };
  
  removeListaDesejo(Id_Produto: number, Id_Cliente: number): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>(`${this.apiRemoveLista}/${Id_Produto}/${Id_Cliente}`);
  };

  removeSelecionadosListaDesejo(produtos: AdminProdutos[], idCliente: number): Observable<AdminResponse> {
    const dados = {
      Id_Cliente: idCliente,
      produtoFormatado: produtos.map(produto => {
        return {
          Id_Produto: produto.Id_Produto,
        };
      })
    };
    return this.http.post<AdminResponse>(this.apiRemoveSelecionadosLista, dados);
  };
}
