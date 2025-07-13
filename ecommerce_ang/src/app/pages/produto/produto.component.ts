import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutosService } from '../../services/produto/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit{
  produtoId: string = '';
  produto: any;

  constructor (
    private route: ActivatedRoute, 
    private router: Router,
    private produtoService: ProdutosService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produto = this.produtoService.getId(id);
    }
  }

  adicionarAoCarrinho(): void {
    this.snackBar.open('Produto adicionado ao carrinho com sucesso!!', 'Fechar', {
      duration: 3000,
      panelClass: ['sucesso-snackbar']
    });
  }

  comprarAgora() {
    this.router.navigate(['/finalizar'], {
      state: { produtos: [this.produto] }
    });
  }
}

