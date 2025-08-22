import { Component, OnInit } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { Router, ActivatedRoute } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth/auth.service';
import { DesejoService } from '../../services/desejo/desejo.service'; 

@Component({
  selector: 'app-lista-desejo',
  templateUrl: './lista-desejo.component.html',
  styleUrl: './lista-desejo.component.scss'
})

export class ListaDesejoComponent implements OnInit {
  produtos: AdminProdutos [] = [];
  produtosSelecionados: any[] = [];


  constructor(
    private route: ActivatedRoute, 
    private desejoService: DesejoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();

    if(usuario && usuario.id) {
      this.desejoService.getListaDesejo(usuario.id).subscribe({
        next: (data: AdminProdutos[]) => {
          this.produtos = data;
          console.log('Usario', usuario.id);
        },

        error: (_error) => {
          this.snackBar.open('Nenhum produtos encontrado na sua lista de desejo.', 'Fechar', { duration: 3000 });
        }
      });

    } else {
      this.snackBar.open('Você precisa estar logado para acessar a lista de desejos.', 'Fechar', {duration: 3000});
      this.router.navigate(['/home']);

    }
  }

  /*onSelecionadoComprar(produtos: any): void {
    if (produtos.selecionado) {
      this.produtosSelecionados.push(produtos);
    } else {
      this.produtosSelecionados = this.produtosSelecionados.filter(p => p.id !== produtos.id);
    }
  }

  adicionarSelecionadosAoCarrinho(): void {
    if (this.produtosSelecionados.length > 0) {
      this.produtosSelecionados.forEach(produtos => {
        // Substituir futuramente com CarrinhoService
        console.log('Adicionado ao carrinho:', produtos.nome);
      });

      this.snackBar.open('Produtos adicionados ao carrinho!', 'Fechar', {
        duration: 3000,
        panelClass: ['sucesso-snackbar']
      });

      // Limpar seleção
      this.produtos.forEach(p => p.selecionado = false);
      this.produtosSelecionados = [];
    }
  }

  comprarAgora(produtos: Produto): void {
    // Substituir futuramente com CarrinhoService
    console.log('Produto adicionado ao carrinho:', produtos);
    this.snackBar.open('Produto adicionado ao carrinho', 'Fechar', {
      duration: 3000
    });
  }*/
}
