import { Component, OnInit } from '@angular/core';
import { DesejoService } from '../../services/desejo/desejo.service'; 
import { Produto } from '../../models/produto';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-desejo',
  templateUrl: './lista-desejo.component.html',
  styleUrl: './lista-desejo.component.scss'
})

export class ListaDesejoComponent implements OnInit {
  listaDesejo: Produto[] = [];
  produtosSelecionados: any[] = [];

  constructor(
    private desejoService: DesejoService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    
  }

  onSelecionadoChange(produto: any): void {
    if (produto.selecionado) {
      this.produtosSelecionados.push(produto);
    } else {
      this.produtosSelecionados = this.produtosSelecionados.filter(p => p.id !== produto.id);
    }
  }

  adicionarSelecionadosAoCarrinho(): void {
    if (this.produtosSelecionados.length > 0) {
      this.produtosSelecionados.forEach(produto => {
        // Substituir futuramente com CarrinhoService
        console.log('Adicionado ao carrinho:', produto.nome);
      });

      this.snackBar.open('Produtos adicionados ao carrinho!', 'Fechar', {
        duration: 3000,
        panelClass: ['sucesso-snackbar']
      });

      // Limpar seleção
      this.listaDesejo.forEach(p => p.selecionado = false);
      this.produtosSelecionados = [];
    }
  }


  remover(id: number): void {
    this.desejoService.remover(id);
    this.listaDesejo = this.listaDesejo.filter(produto => produto.id !== id);
    this.produtosSelecionados = this.produtosSelecionados.filter(p => p.id !== id);
    this.snackBar.open('Produto removido da lista de desejos', 'Fechar', {
      duration: 3000
    });
  }

  comprar(produto: Produto): void {
    // Substituir futuramente com CarrinhoService
    console.log('Produto adicionado ao carrinho:', produto);
    this.snackBar.open('Produto adicionado ao carrinho', 'Fechar', {
      duration: 3000
    });
  }
}
