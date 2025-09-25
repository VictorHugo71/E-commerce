import { Component } from '@angular/core';

import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  produtos: AdminProdutos[] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';
  valorTotal = 0;

  usuario = {
    id: "",
    nome : "",
    email : "",
    telefone : "",
    cpf : "",
    avatar : "",
    endereco : [] as any [],
  };
  enderecos: any[] =[];

  constructor(
    
  ) {}

  
}
