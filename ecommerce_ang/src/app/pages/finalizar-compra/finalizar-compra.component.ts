import { Component } from '@angular/core';
import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';

@Component({
  selector: 'app-finalizar-compra',
  templateUrl: './finalizar-compra.component.html',
  styleUrl: './finalizar-compra.component.scss'
})
export class FinalizarCompraComponent {
  produtos: AdminProdutos [] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';
  valorTotal = 0;
}
