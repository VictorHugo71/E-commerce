import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AdminAuthService } from '../../services/admin/auth/admin-auth.service'; 

import { ProdutosService } from '../../services/produto/produtos.service';
import { Categoria } from '../../models/admin/produtos/categorias';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  produtos: AdminProdutos[] = [];
  categorias: Categoria[] = [];
  
  constructor (
    private router: Router,
    private produtoService: ProdutosService,

    public authService: AuthService,
    public adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(
      (data: AdminProdutos[]) => {
        this.produtos = data;
        console.log(this.produtos);
      }
    );
    this.produtoService.getCategorias().subscribe(
      (data: Categoria[]) => {
        this.categorias = data;
        console.log(this.categorias);
      }
    );
  }

  //Veriicar Cliente Logado
  get estaLogadoCliente():boolean {
    return this.authService.estaLogado();
  }

  //Verifica Admin Logado
  get estaLogadoAdmin(): boolean {
    return this.adminAuthService.isLoggedIn();
  }

  //Logout para Admin e Cliente
  logout() {
    //Chama o logout de ambos os services
    this.authService.logout();
    this.adminAuthService.logout();
    this.router.navigate(['/home']);
  }
}
