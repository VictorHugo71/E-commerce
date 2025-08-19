import { Injectable } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos'; 
import { Categoria } from '../../models/admin/produtos/categorias';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private apiUrl = 'http://localhost/neziara-sgbd/';
  private urlGetCategorias = `${this.apiUrl}admin/produtos/categorias.php`;
  private urlGetProdutos = `${this.apiUrl}admin/produtos/`;

  private produtos: AdminProdutos[] = [];
  private categorias: Categoria[] = [];

  constructor(
    private http: HttpClient
  ) { }
  
  getProdutos(): Observable<AdminProdutos[]> {
    return this.http.get<AdminProdutos[]>(this.urlGetProdutos);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlGetCategorias);
  }
  
  getIdProduto(id: number): Observable<AdminProdutos> {
    return this.http.get<AdminProdutos>(`${this.urlGetProdutos}/${id}`);
  }
}
