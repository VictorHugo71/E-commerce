import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProdutosService } from '../../services/produto/produtos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Produto } from '../../models/produto';
import { DesejoService } from '../../services/desejo/desejo.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit{
  produtoId: number = 0;
  produto!: Produto;

  constructor (
    private route: ActivatedRoute, 
    private router: Router,
    private snackBar: MatSnackBar,
    private produtoService: ProdutosService,
    private desejoService: DesejoService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const produtoEncontrado = this.produtoService.getId(id);
  
    if (produtoEncontrado) {
      this.produto = produtoEncontrado;
    } else {
      this.snackBar.open('Produto não encontrado.', 'Fechar', { duration: 3000 });
      this.router.navigate(['/home']);
    }
  }
  

  adicionarAoCarrinho(): void {
    this.desejoService.adicionar(this.produto);
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

