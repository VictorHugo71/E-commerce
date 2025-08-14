import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminProdutos } from '../../../models/admin/produtos/admin-produtos';
import { Categoria } from '../../../models/admin/produtos/categorias';
import { AdminResponse } from '../../../models/admin/admin-response';

@Injectable({
  providedIn: 'root'
})
export class CadastroProdutosService {
  private apiUrl = 'http://localhost/neziara-sgbd/';
  private urlGetCategorias = `${this.apiUrl}admin/produtos/categorias.php`
  private urlAddProdutos = `${this.apiUrl}admin/produtos/cadastrar-produtos.php`

  constructor(
    private http: HttpClient,
  ) { }

  addProduto(produtos: AdminProdutos): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(this.urlAddProdutos, produtos);
  }

  getCategoria(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlGetCategorias);
  }
}
