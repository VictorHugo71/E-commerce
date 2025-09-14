import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { AdminResponse } from '../../models/admin/admin-response';
import { AllAuthService } from '../../services/auth/all-auth.service'; 
import { CompraService } from '../../services/compra/compra.service';

@Component({
  selector: 'app-finalizar-compra',
  templateUrl: './finalizar-compra.component.html',
  styleUrl: './finalizar-compra.component.scss'
})
export class FinalizarCompraComponent {
  produtos: AdminProdutos [] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';
  valorTotal = 0;

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private allAuthService: AllAuthService,
    private compraService: CompraService,
  ) {}

  ngOnInit(): void {
    const userId = this.allAuthService.getUserIdFromToken();

    if(userId) {
      this.compraService.getCarrinho(userId).subscribe({
        next: (data: AdminProdutos[]) => {
          this.produtos = data;
        },
        error: (_error) => {
          this.snackBar.open('Nenhum produto encontrado no seu Carrinho.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  diminuiQuantidade(Id_Produto: number | undefined): void {
    
  }

  aumentaQuantidade(Id_Produto: number | undefined): void {

  } 

  verificaQuantidade(quantidade: number, produto: AdminProdutos) {
    const userId = Number(this.allAuthService.getUserIdFromToken());

    if(quantidade <= 0) {
      const confirmou = window.confirm('Deseja remover este item do seu Carrinho?');
      if(confirmou) {
        this.removerProduto(produto.Id_Produto);
        return;
      } else {
        produto.Quantidade = 1;

        if(userId && produto.Id_Produto !== undefined) {
          this.compraService.atualizaQuantidadeCarrinho(produto.Id_Produto, userId, produto.Quantidade).subscribe({
            next: (data: AdminResponse) => {
              this.mensagemSucesso = data.mensagem || 'Quantidade redefinida para 1';
              this.snackBar.open(this.mensagemSucesso, 'Fechar', {duration: 3000});
            },
            error: (err: AdminResponse) => {
              this.mensagemErro = err.mensagem || 'Erro ao redefinir quantidade';
              this.snackBar.open(this.mensagemErro, 'Fechar', {duration: 3000});
            }
          });
        }
        return;
      }

    } else {
      if(userId && produto.Id_Produto !== undefined) {
        this.compraService.atualizaQuantidadeCarrinho(produto.Id_Produto, userId, produto.Quantidade).subscribe({
          next: (data: AdminResponse) => {
            this.mensagemSucesso = data.mensagem || 'Quantidade do produto atualizada';
            this.snackBar.open(this.mensagemSucesso, 'Fechar', {duration: 3000});
          },
          error: (err: AdminResponse) => {
            this.mensagemErro = err.mensagem || 'Erro ao alterar quantidade do produto';
            this.snackBar.open(this.mensagemErro, 'Fechar', {duration: 3000});  
          }
        });
      }
      return;
    }
  }

  removerProduto(Id_Produto: number | undefined): void {
    if(!Id_Produto) {
      this.snackBar.open('ID do produto não encontrado.', 'Fechar', { duration: 3000 });
      return; // Para a execução da função aqui
    }
    const userId = this.allAuthService.getUserIdFromToken();
    
    if(userId) {
      this.compraService.removeCarrinho(Id_Produto, userId).subscribe({
        next: (data: AdminResponse) => {
          this.snackBar.open(data.mensagem, 'Fechar', { duration: 3000 });
          const index = this.produtos.findIndex(p => p.Id_Produto === Id_Produto);
          if(index > -1) {
            this.produtos.splice(index, 1);
          }
        },
        error: (_error) => {
          this.snackBar.open('Não foi possível remover o item do Carrinho.', 'Fechar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Você precisa estar logado para acessar o Carrinho.', 'Fechar', {duration: 3000});
      this.router.navigate(['/home']);
    }
  }
}
