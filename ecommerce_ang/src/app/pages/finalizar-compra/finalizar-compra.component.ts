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

  diminuiQuantidade(produto: AdminProdutos): void {
    const userId = Number(this.allAuthService.getUserIdFromToken());

    if(userId && produto.Id_Produto && produto.Quantidade !== undefined) {
      produto.Quantidade--;
      this.atualizaCarrinhoBack(produto.Id_Produto, userId, produto.Quantidade);
    } else {
      this.snackBar.open('Não foi possível atualizar a quantidade do produto. Tente novamente.', 'Fechar', {duration: 3000});
    }
  }

  aumentaQuantidade(produto: AdminProdutos): void {
    const userId = Number(this.allAuthService.getUserIdFromToken());

    if(userId && produto.Id_Produto && produto.Quantidade !== undefined) {
      produto.Quantidade++;
      this.atualizaCarrinhoBack(produto.Id_Produto, userId, produto.Quantidade);
    } else {
      this.snackBar.open('Dados de usuário ou produto inválidos. Tente novamente.', 'Fechar', {duration: 3000});
    }
  } 

  verificaQuantidade(quantidade: number, produto: AdminProdutos) {
    const userId = Number(this.allAuthService.getUserIdFromToken());

    //Adicionar verificação de userId && produto.Id_Produto && produto.Quantidade uma unica vez ao invés ter que fazer toda vez essa verificação
      if(quantidade <= 0) {
        const confirmou = window.confirm('Deseja remover este item do seu Carrinho?');
        if(confirmou) {
          this.removerProduto(produto.Id_Produto);
          return;
        } else {
          produto.Quantidade = 1;
          this.atualizaCarrinhoBack(produto.Id_Produto!, userId, produto.Quantidade);
          return;
        }
      } 
      
      if(produto.Estoque !== undefined && quantidade > produto.Estoque) {
        produto.Quantidade = produto.Estoque;
        this.snackBar.open(`Quantidade maior que a disponível em estoque (máx: ${produto.Estoque}).`, 'Fechar', { duration: 6000 });
        
        if(userId && produto.Id_Produto && produto.Quantidade !== undefined) {
          this.atualizaCarrinhoBack(produto.Id_Produto, userId, produto.Quantidade);
        }
        return;

      } else{
        if(userId && produto.Id_Produto && produto.Quantidade !== undefined) {
          this.atualizaCarrinhoBack(produto.Id_Produto, userId, produto.Quantidade);
        }
        return;
      }
  }

  atualizaCarrinhoBack(idProduto: number, userId: number, quantidade: number) {
    if(idProduto && userId && quantidade !== undefined) {
      this.compraService.atualizaQuantidadeCarrinho(idProduto, userId, quantidade).subscribe({
        next: (data: AdminResponse) => {
          this.mensagemSucesso = data.mensagem || 'Quantidade atualizada';
          this.snackBar.open(this.mensagemSucesso, 'Fechar', {duration: 3000});
        },
        error: (err: AdminResponse) => {
          this.mensagemErro = err.mensagem || 'Erro ao alterar quantidade';
          this.snackBar.open(this.mensagemErro, 'Fechar', {duration: 3000});
        }
      });
    } else {
      this.snackBar.open('Dados de usuário ou produto inválidos', 'Fechar', {duration: 3000});
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
