import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../services/produto/produtos.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AdminAuthService } from '../../services/admin/auth/admin-auth.service'; 

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  produtos: any [] = [];
  categorias: string[] = [];
  
  constructor (
    private router: Router,
    private produtoService: ProdutosService,

    public authService: AuthService,
    public adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.produtos = this.produtoService.getTodos();
    this.categorias = this.produtoService.getCategorias();
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
