import { Injectable } from '@angular/core';
import { Produto } from '../../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutosService {
  private produtos: Produto[] = [
    {
      id: 1,
      nome: 'Fone Bluetooth',
      preco: 99.90,
      imagem: 'uploads/fone.jpg',
      descricao: 'Fone bluetooth legal'
    },
    {
      id: 2,
      nome: 'Smartwatch',
      preco: 149.90,
      imagem: 'smartwatch.jpg',
      descricao: 'smartwatch legal'
    },
    {
      id: 3,
      nome: 'Câmera de Segurança',
      preco: 199.90,
      imagem: 'camera.jpg',
      descricao: 'camera legal'
    },
    {
      id: 4,
      nome: 'Notebook Dell',
      preco: 3599.00,
      imagem: 'notebook.jpg',
      descricao: 'Notebook legal'
    },
    {
      id: 5,
      nome: 'Monitor Gamer 144Hz',
      preco: 1249.00,
      imagem: 'monitor.jpg',
      descricao: 'Monitor legal'
    },
    {
      id: 6,
      nome: 'Mouse sem fio',
      preco: 79.90,
      imagem: 'mouse.jpg',
      descricao: 'Mouse legal'
    }
  ];

  private categorias = [
    'Eletrônicos',
    'Moda',
    'Casa e Decoração',
    'Beleza',
    'Brinquedos',
    'Esporte e Lazer'
  ];

  getTodos() {
    return this.produtos;
  }

  getId(id: number): Produto | undefined {
    return this.produtos.find(p => p.id === id);
  }

  getCategorias() {
    return this.categorias;
  }
  constructor() { }
}
