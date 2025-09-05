import { Component, OnInit } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

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

  diminuiQuantidade() {
    
  }

  aumentaQuantidade() {

  }

  removerProduto() {

  }
}
