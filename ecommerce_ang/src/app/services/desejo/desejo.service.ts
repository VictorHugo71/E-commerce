import { Injectable } from '@angular/core';
import { Produto } from '../../models/produto';

@Injectable({
  providedIn: 'root'
})
export class DesejoService {
  private listaDesejo: Produto[] = [];

  adicionar(produto: Produto): void {
    const jaExiste = this.listaDesejo.some(p => p.id === produto.id);
    if(!jaExiste) {
      this.listaDesejo.push(produto);
    }
  }

  remover(id: number): void {
    this.listaDesejo = this.listaDesejo.filter(p => p.id !== id);
  }

  getTodos(): Produto[] { //listar também pode ser  o nome
    return this.listaDesejo;
  }

  limpar(): void {
    this.listaDesejo = [];
  }
  constructor() { }
}
