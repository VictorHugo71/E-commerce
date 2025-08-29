import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { Categoria } from '../../models/admin/produtos/categorias';
import { ProdutosService } from '../../services/produto/produtos.service';

import { AllAuthService } from '../../services/auth/all-auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  produtos: AdminProdutos[] = [];
  categorias: Categoria[] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';

  
  constructor (
    private router: Router,
    private produtoService: ProdutosService,

    public allAuthService: AllAuthService
  ) {}

  ngOnInit(): void {    
    this.produtoService.getProdutos().subscribe(
      (data: AdminProdutos[]) => {
        this.produtos = data;
      }
    );
    this.produtoService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
      }
    );
  }

  //Logout para Admin e Cliente
  logout() {
    this.allAuthService.logout();
  }
}
