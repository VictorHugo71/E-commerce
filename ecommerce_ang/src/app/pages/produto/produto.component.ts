import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutosService } from '../../services/produto/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DesejoService } from '../../services/desejo/desejo.service';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit{
  produtoId: number = 0;
  produto: AdminProdutos | undefined;

  constructor (
    private route: ActivatedRoute, 
    private router: Router,
    private snackBar: MatSnackBar,
    private produtoService: ProdutosService,
    private desejoService: DesejoService,
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
  

  adicionarAoCarrinho(): void {
    if(this.produto) {
      this.desejoService.adicionar(this.produto);
      this.snackBar.open('Produto adicionado ao carrinho com sucesso!!', 'Fechar', {
        duration: 3000,
        panelClass: ['sucesso-snackbar']
      });
    } else {
      this.snackBar.open('Não foi possivel adiconar o produto ao carrinho.', 'Fechar');
    }
  }

  comprarAgora() {
    if(this.produto) {
      this.router.navigate(['/finalizar'], {
        state: { produtos: [this.produto] }
      });
    }
  }
}

