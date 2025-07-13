import { Component, OnInit } from '@angular/core';
import { ProdutosService } from '../../services/produto/produtos.service';
import { URL } from 'node:url';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  produtos: any [] = [];

  categorias: string[] = [];
  
  constructor (private produtoService: ProdutosService) {}

  ngOnInit(): void {
    this.produtos = this.produtoService.getTodos();
    this.categorias = this.produtoService.getCategorias();
  }
}
