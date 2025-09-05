import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutosService } from '../../services/produto/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

import { AllAuthService } from '../../services/auth/all-auth.service'; 
import { DesejoService } from '../../services/desejo/desejo.service';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { CompraService } from '../../services/compra/compra.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit{
  produtoId: number = 0;
  produto: AdminProdutos | undefined;
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor (
    private route: ActivatedRoute, 
    private router: Router,
    private snackBar: MatSnackBar,
    private produtoService: ProdutosService,
    private desejoService: DesejoService,
    private allAuthService: AllAuthService,
    private compraService: CompraService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    if (id) {
      this.produtoService.getIdProduto(id).subscribe(
        (data) => {
          this.produto = data;
        },
        (_error) => {
          this.snackBar.open('Produto não encontrado.', 'Fechar', { duration: 3000 });
          this.router.navigate(['/home']);
        }
      );
    } else {
      this.snackBar.open('ID do produto inválido.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/home']);
    }
  }
  
  async adicionarListaDesejo(produto: AdminProdutos): Promise<void> {
    const userId = this.allAuthService.getUserIdFromToken();

    if (!userId) {
      this.snackBar.open('Você precisa estar logado para adicionar produtos à Lista de Desejo.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/login']); // Redireciona para o login
      return;
    }

    if(produto && produto.Id_Produto) {
      try {
        const idProduto = produto.Id_Produto;
        
        const resultado = await firstValueFrom(this.desejoService.addListaDesejo(idProduto, userId));
        this.mensagemSucesso = resultado?.mensagem || 'Produto adicionado com sucesso à Lista de Desejo';

        this.snackBar.open(this.mensagemSucesso, 'Fechar', { duration: 3000 });


      } catch(error: any) {
        this.mensagemErro = error?.error?.mensagem || 'Erro ao adicionar produto à Lista de Desejo';
        this.snackBar.open(this.mensagemErro, 'Fechar', { duration: 3000 });
      }
    }
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