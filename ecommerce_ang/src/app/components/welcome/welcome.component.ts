import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../services/produto/produtos.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

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
    public authService: AuthService) {}

  ngOnInit(): void {
    this.produtos = this.produtoService.getTodos();
    this.categorias = this.produtoService.getCategorias();
  }

  get estaLogado():boolean {
    return localStorage.getItem('usuario') !== null;
  }

  logout() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/home']);
  }
}
