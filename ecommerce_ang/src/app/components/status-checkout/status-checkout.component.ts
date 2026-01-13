import { Component, OnInit, Input } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-status-checkout',
  templateUrl: './status-checkout.component.html',
  styleUrl: './status-checkout.component.scss'
})
export class StatusCheckoutComponent implements OnInit{

  /*statusPagamento: string = '';
  idPedido: string | null = null;
  mensagemUsuario: string = '';*/

  @Input() status!: string;
  @Input() id!: string;
  
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('Status recebido:', this.status);
    console.log('ID do pedido recebido:', this.id);
  }
}
