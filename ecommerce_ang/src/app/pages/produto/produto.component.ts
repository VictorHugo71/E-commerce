import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutosService } from '../../services/produto/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth/auth.service';
import { DesejoService } from '../../services/desejo/desejo.service';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { firstValueFrom } from 'rxjs';


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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
  
    if (id) {
      this.produtoService.getIdProduto(id).subscribe(
        (data) => {
          this.produto = data;
          console.log(this.produto); 
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
  
  async adicionarAoCarrinho(produto: AdminProdutos): Promise<void> {
    const usuario = this.authService.getUsuario();

    if(usuario && produto && produto.Id_Produto) {
      try {
        const idProduto = produto.Id_Produto;
        const idCliente = usuario.id;


        const resultado = await firstValueFrom(this.desejoService.addListaDesejo(idProduto, idCliente));
        this.mensagemSucesso = resultado?.mensagem || 'Produto adicionado com sucesso à Lista de Desejo';

        this.snackBar.open(this.mensagemSucesso, 'Fechar', { duration: 3000 });

        console.log(idProduto, idCliente);

      } catch(error: any) {
        this.mensagemErro = error?.error?.mensagem || 'Erro ao adicionar produto à Lista de Desejo';
        this.snackBar.open(this.mensagemErro, 'Fechar', { duration: 3000 });
      }
    }
  }

  /*comprarAgora() {
    if(this.produto) {
      this.router.navigate(['/finalizar'], {
        state: { produtos: [this.produto] }
      });
    }
  }*/
}

