import { Injectable } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';

@Injectable({
  providedIn: 'root'
})
export class DesejoService {
  private listaDesejo: AdminProdutos[] = [];

  adicionar(produto: AdminProdutos): void {
    const jaExiste = this.listaDesejo.some(p => p.Id_Produto === produto.Id_Produto);
    if(!jaExiste) {
      this.listaDesejo.push(produto);
    }
  }

  remover(id: number): void {
    this.listaDesejo = this.listaDesejo.filter(p => p.Id_Produto !== id);
  }

  getTodos(): AdminProdutos[] { //listar também pode ser  o nome
    return this.listaDesejo;
  }

  limpar(): void {
    this.listaDesejo = [];
  }
  constructor() { }
}
