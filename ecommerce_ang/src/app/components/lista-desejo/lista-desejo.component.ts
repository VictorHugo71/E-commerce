import { Component, OnInit } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { Router, ActivatedRoute } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth/auth.service';
import { DesejoService } from '../../services/desejo/desejo.service'; 
import { AdminResponse } from '../../models/admin/admin-response';

@Component({
  selector: 'app-lista-desejo',
  templateUrl: './lista-desejo.component.html',
  styleUrl: './lista-desejo.component.scss'
})

export class ListaDesejoComponent implements OnInit {
  produtos: AdminProdutos [] = [];
  produtosSelecionados: any[] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';
  public usuario: any;


  constructor(
    private route: ActivatedRoute, 
    private desejoService: DesejoService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if(this.usuario && this.usuario.id) {
      this.desejoService.getListaDesejo(this.usuario.id).subscribe({
        next: (data: AdminProdutos[]) => {
          this.produtos = data;
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

  removeProduto(Id_Produto: number | undefined): void {
    if (!Id_Produto) {
      this.snackBar.open('ID do produto não encontrado.', 'Fechar', { duration: 3000 });
      return; // Para a execução da função aqui
    }
    
    this.usuario = this.authService.getUsuario();

    if(this.usuario && this.usuario.id) {
      this.desejoService.removeListaDesejo(Id_Produto, this.usuario.id).subscribe({
        next: (data : AdminResponse) => {
          this.snackBar.open(data.mensagem, 'Fechar', { duration: 3000 });

          const index = this.produtos.findIndex(p => p.Id_Produto === Id_Produto); //encontra o indice do produto dentro do array
          if(index > -1) {                                            // ^ valor que é para ser encontrado no arrays
            //se o findIndex não encontra nada ele retorna -1, caso ele encontre ele retorna a posição do item no array que é 0 ou algum numero positivo
            this.produtos.splice(index, 1);
          }
        },

        error: (_error) => {
          this.snackBar.open('Não foi possível remover o iten da lista de desejo.', 'Fechar', { duration: 3000 });
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
