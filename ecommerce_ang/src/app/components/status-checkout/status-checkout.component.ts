import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-status-checkout',
  templateUrl: './status-checkout.component.html',
  styleUrl: './status-checkout.component.scss'
})
export class StatusCheckoutComponent implements OnInit{

  statusPagamento: string = '';
  idPedido: string | null = null;
  mensagemUsuario: string = '';
  
  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.statusPagamento = params['status'] || '';
      this.idPedido = params['external_reference'] || null;

      this.definirMensagem();
    });
  }

  definirMensagem(): void {
    switch (this.statusPagamento) {
      case 'approved':
        this.mensagemUsuario ='Seu pagamento foi APROVADO! O pedido está sendo processado.';
        break;
      case 'pending':
        this.mensagemUsuario ='Pagamento PENDENTE. Estamos aguardando a confirmação do banco.';
        break;
      case 'rejected':
      case 'cancelled':
        this.mensagemUsuario = 'Seu pagamento foi REJEITADO ou CANCELADO. Tente novamente.';
        break;
      default:
        this.mensagemUsuario = 'Status de pagamento desconhecido. Por favor, entre em contato com o suporte.';
    }
  }
}
