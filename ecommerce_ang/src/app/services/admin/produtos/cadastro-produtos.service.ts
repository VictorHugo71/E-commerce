import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminResponse } from '../../../models/admin/admin-response';
import { Categoria } from '../../../models/admin/produtos/categorias';

interface NovaCategoriaRequest {
  nome: string
}

@Injectable({
  providedIn: 'root'
})
export class CadastroProdutosService {
  private apiUrl = 'http://localhost/neziara-sgbd/';
  private urlCategorias = `${this.apiUrl}admin/produtos/categorias.php`
  private urlAddProdutos = `${this.apiUrl}admin/produtos/cadastrar-produtos.php`

  constructor(
    private http: HttpClient,
  ) { }

  addProduto(formData: FormData): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(this.urlAddProdutos, formData);
  }

  getCategoria(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.urlCategorias);
  }

  addCategoria(nomeCategoria: string): Observable<AdminResponse> {
    const categoriaData: NovaCategoriaRequest = { nome: nomeCategoria };
    return this.http.post<AdminResponse>(this.urlCategorias, categoriaData);
  }
}
