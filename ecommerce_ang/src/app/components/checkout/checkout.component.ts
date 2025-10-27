export type MetodoPagamento = 'pix' | 'cartao_credito' | 'boleto';

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';

import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { AdminResponse } from '../../models/admin/admin-response';

import { Endereco } from '../../models/endereco/endereco';
import { PayloadMP } from '../../models/payloadMP/payload-mp';
import { ItemCarrinhoMP } from '../../models/carrinho/item-carrinhoMP';

import { AllAuthService } from '../../services/auth/all-auth.service';
import { PerfilService } from '../../services/cliente/perfil/perfil.service';
import { CheckoutService } from '../../services/compra/pedido/checkout.service';
import { CompraService } from '../../services/compra/compra.service';
import { Produto } from '../../models/produto';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})

export class CheckoutComponent {
  produtos: AdminProdutos[] = [];
  itens: ItemCarrinhoMP[] = [];
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';
  valorTotal = 0;

  usuario = {
    id: 0,
    email : "",
    telefone: "",
    endereco : [] as any [],
  };
  enderecos: Endereco[] =[];

  mensagemSucesso = '';
  mensagemErro = '';

  formEndereco: FormGroup;
  formPagamento: FormGroup;
  
  metodoSelecionado: MetodoPagamento | null = null;

  constructor(
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private allAuthService:  AllAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private compraService: CompraService,
    private checkoutService: CheckoutService
  ) {
    this.formEndereco = this.formBuilder.group({
      idEnderecoSelecionado: [null as number | null, Validators.required]
    });

    this.formPagamento = this.formBuilder.group({
      metodoPagamento: [null as MetodoPagamento | null, Validators.required]
    });
  }

  ngOnInit(): void {
    const userData = this.allAuthService.getUserDataFromToken();

    if(!userData || !userData.email) {
      console.error('Email não encontrado no token JWT. Redirecionando...');
      this.router.navigate(['/login']);
      return;
    }

    this.perfilService.obterPerfil({email: userData.email}).subscribe({
      next:(res) => {
        const user = res.usuario;
        this.usuario = {
          id: user.id,
          email: user.email,
          telefone: user.telefone,
          endereco: []
        };
        this.obterEnderecos();
        this.obterCarrinho();
      },
      error:(err) => {
        console.error('Erro ao carregar perfil:', err)
      }
    });
  }

  //==================//
  //  TS de Endereço  //
  //==================//
  obterEnderecos(): void {
    if(!this.usuario.id) return;

    this.perfilService.obterEnderecos({id: this.usuario.id}).subscribe({
      next: (res: any) => {
        this.enderecos = res.enderecos || [];
        this.selecionarEnderecoPrincipal();
      },
      error: (err: any) => {
        this.snackBar.open('Erro ao carregar dados de Endereço.', 'Fechar', {duration: 3000});
      }
    });
  }

  selecionarEnderecoPrincipal(): void {
    const principal = this.enderecos.find(e => e.principal === true);

    if(principal) {
      this.selecionarEndereco(principal.idEndereco);
    } else if (this.enderecos.length > 0) {
      this.selecionarEndereco(this.enderecos[0].idEndereco);
    }
  }

  //=======================================//
  //    ÁREA DO DIALOG DE ENDEREÇO         //
  //=======================================//
  abrirDialogNovoEndereco(): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enderecos.push(result);
        this.usuario.endereco = [...this.enderecos];

        this.salvarEnderecosCheckout();
      }
    });
  }

  editarEndereco(endereco: Endereco): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '450px',
      data: { endereco: { ...endereco } }
    });

    dialogRef.afterClosed().subscribe((result: Endereco) => {
      if (result && result.idEndereco) {
        const index = this.enderecos.findIndex(e => e.idEndereco === result.idEndereco);
        if (index !== -1) {
          this.enderecos[index] = result;
          this.usuario.endereco = [...this.enderecos];
          this.salvarEnderecosCheckout();
        }
      }
    });
  }
  //=======================================//
  //   FIM DA ÁREA DO DIALOG DE ENDEREÇO   //
  //=======================================//


  selecionarEndereco(enderecoId: number | undefined) {
    this.formEndereco.get('idEnderecoSelecionado')?.setValue(enderecoId);

    console.log('Endereço selecionado: ', enderecoId);
  }

  salvarEnderecosCheckout(): void { //Envia um arrays com TODOS os endereços do cliente
    const enderecosBackend = this.enderecos.map(e => ({
      Id_Endereco: e.idEndereco,
      Estado: e.estado,
      Cidade: e.cidade,
      Bairro: e.bairro,
      Logradouro: e.logradouro,
      Complemento: e.complemento,
      Numero: e.numero,
      Cep: e.cep,
      Principal: e.principal ? 1 : 0,
    }));

    const payloadEnderecos = {
      Cliente_Id: this.usuario.id,
      endereco: enderecosBackend
    };

    this.perfilService.gerenciarEnderecos(payloadEnderecos).subscribe({
      next: (res: AdminResponse) => {
        this.mensagemSucesso = res.mensagem || 'Dados de endereço atualizados com suceesso';
        this.snackBar.open(this.mensagemSucesso, 'Fechar', {duration: 3000});
        this.ngOnInit();
      },
      error: (err: AdminResponse) => {
        this.mensagemErro = err.mensagem || 'Falha ao atualizar dados de endereço';
      }
    });
  }

  //=========================//
  //  FIM do TS de Endereço  //
  //=========================//



  //===================//
  //   TS de Revisão   //
  //===================//
  obterCarrinho():void {
    if(!this.usuario.id) return;

    this.compraService.getCarrinho(this.usuario.id).subscribe({
      next: (res: AdminProdutos[]) => {
        this.produtos = res;
        this.calcularTotal();
      },
      error: (_error) => {
        this.snackBar.open('Nenhum produto encontrado no seu Carrinho.', 'Fechar', { duration: 3000 });
      }
    });
  }

  calcularTotal() {
    this.valorTotal = 0;
    this.produtos.forEach(produto =>{
      this.valorTotal += produto.Preco * produto.Quantidade!;
    });
  }
  //===========================//
  //   FIM do TS de Revisão    //
  //===========================//



  //===================//
  //  TS de Pagamento  //
  //===================//
  selecionarMetodo(metodo: MetodoPagamento): string {
    this.metodoSelecionado = metodo;

    //Atualiza o valor de formulário para torná-lo VÁLIDO
    this.formPagamento.get('metodoPagamento')?.setValue(metodo);

    console.log('Método de pagamento selecionado: ', metodo);

    //lógica condicional
    return this.metodoSelecionado;
  }

  montarPayload(): PayloadMP{
    const idSelecionado = this.formEndereco.get('idEnderecoSelecionado')?.value;
    const enderecoSelecionado = this.enderecos.find(e => e.idEndereco === idSelecionado);

    if(!enderecoSelecionado) {
      throw new Error("Endereço de envio não selecionado.");
    }
    
    const enderecoMP = {
        idEndereco: enderecoSelecionado.idEndereco,
        idCliente: enderecoSelecionado.idCliente,
        estado: enderecoSelecionado.estado,
        cidade: enderecoSelecionado.cidade,
        bairro: enderecoSelecionado.bairro,
        logradouro: enderecoSelecionado.logradouro,
        complemento: enderecoSelecionado.complemento,
        numero: enderecoSelecionado.numero,
        cep: enderecoSelecionado.cep,
      }

    const usuarioMP = {
      idCliente: this.usuario.id,
      emailCliente: this.usuario.email,
      telefoneCliente: this.usuario.telefone
    };

    const pagamentoMP = {
      metodoPagamento: this.metodoSelecionado,
      valorTotal: this.valorTotal,
    }
      
    const itensMP: ItemCarrinhoMP[] = this.produtos.filter(p => p.Quantidade && p.Quantidade > 0).map(p => ({
      Id_Produto: p.Id_Produto,
      Quantidade: p.Quantidade,
      Preco_Unitario: p.Preco,
    }));

    const payloadFinal: PayloadMP = {
      ...usuarioMP,
      ...pagamentoMP,
      enderecoEnvio: enderecoMP,
      itens: itensMP,
    }

    return payloadFinal;
  }

  iniciarPagamento():void {
    const payload = this.montarPayload();

    console.log('Payload: ',  payload);
  }

  //===========================//
  //  FIM do TS de Pagameento  //
  //===========================//
}
