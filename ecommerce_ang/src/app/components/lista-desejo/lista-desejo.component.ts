import { Component, OnInit } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { Router, ActivatedRoute } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

import { AllAuthService } from '../../services/auth/all-auth.service';
import { AdminResponse } from '../../models/admin/admin-response';
import { DesejoService } from '../../services/desejo/desejo.service'; 
import { CompraService } from '../../services/compra/compra.service';

@Component({
  selector: 'app-lista-desejo',
  templateUrl: './lista-desejo.component.html',
  styleUrl: './lista-desejo.component.scss'
})

export class ListaDesejoComponent implements OnInit {
  produtos: AdminProdutos [] = [];
  produtosSelecionados: any[] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';
  private mensagemSucesso = '';
  private mensagemErro = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private snackBar: MatSnackBar,
    private allAuthService: AllAuthService,
    private desejoService: DesejoService,
    private compraService: CompraService,
  ) {}

  ngOnInit(): void {
    // Obter o ID do usuário diretamente do token
    const userId = this.allAuthService.getUserIdFromToken();

    if(userId) {
      this.desejoService.getListaDesejo(userId).subscribe({
        next: (data: AdminProdutos[]) => {
          this.produtos = data;
        },
        error: (_error) => {
          this.snackBar.open('Nenhum produto encontrado na sua lista de desejo.', 'Fechar', { duration: 3000 });
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
    
    const userId = this.allAuthService.getUserIdFromToken();

    if(userId) {
      this.desejoService.removeListaDesejo(Id_Produto, userId).subscribe({
        next: (data : AdminResponse) => {
          this.snackBar.open(data.mensagem, 'Fechar', { duration: 3000 });
          const index = this.produtos.findIndex(p => p.Id_Produto === Id_Produto);
          if(index > -1) {
            this.produtos.splice(index, 1);
          }
        },
        error: (_error) => {
          this.snackBar.open('Não foi possível remover o item da lista de desejo.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Você precisa estar logado para acessar a lista de desejos.', 'Fechar', {duration: 3000});
      this.router.navigate(['/home']);
    }
  }

  adicionarSelecionadosAoCarrinho() {
    const userId = Number(this.allAuthService.getUserIdFromToken());

    const produtosSelecionados = this.produtos.filter(produto => {
      return produto.selecionado;
    });

    if(userId !== undefined && produtosSelecionados.length > 0) {
      this.compraService.addSelecionadosCarrinho(produtosSelecionados, userId).subscribe({
        next: (data: AdminResponse) => {
          this.snackBar.open(data.mensagem, 'Fechar', {duration: 3000});
          this.produtos = this.produtos.filter(produto => !produto.selecionado);

          //adicionar o service de remover itens da lista de desejo
          this.desejoService.removeSelecionadosListaDesejo(produtosSelecionados, userId).subscribe({
            next: (dataRemocao: AdminResponse) => {
              this.snackBar.open(dataRemocao.mensagem, 'Fechar', {duration: 3000});
            },
            error: (errRemocao: AdminResponse) => {
              this.snackBar.open(errRemocao.mensagem, 'Fechar', {duration: 3000});
            }
          });
        },
        error: (err: AdminResponse) => {
          this.snackBar.open(err.mensagem, 'Fechar', {duration: 3000});
        }
      });
    } else {
      this.snackBar.open('Dados inválidos', 'Fechar', {duration: 3000});
    }
  }

  get selecionados() {
    const produtosSelecionados = this.produtos.filter(produto => {
      return produto.selecionado;
    });
    return produtosSelecionados;
  }

  async comprarAgora(produto: AdminProdutos): Promise<void> {
    const userId = this.allAuthService.getUserIdFromToken();

    if (!userId) {
      this.snackBar.open('Você precisa estar logado para adicionar produtos ao Carrinho.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/login']); // Redireciona para o login
      return;
    }

    if(produto && produto.Id_Produto) {
      try {
        const idProduto = produto.Id_Produto;
        const quantidadeInicial = 1;
        
        const resultado = await firstValueFrom(this.compraService.addCarrinho(idProduto, userId, quantidadeInicial));
        this.mensagemSucesso = resultado?.mensagem || 'Produto adicionado com sucesso ao Carrinho';

        this.snackBar.open(this.mensagemSucesso, 'Fechar', { duration: 3000 });
        this.router.navigate(['/finalizar']);

      } catch(error: any) {
        this.mensagemErro = error?.error?.mensagem || 'Erro ao adicionar produto ao Carrinho';
        this.snackBar.open(this.mensagemErro, 'Fechar', { duration: 3000 });
      }
    }
  }
}