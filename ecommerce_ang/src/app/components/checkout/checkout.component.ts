export type MetodoPagamento = 'pix' | 'cartao_credito' | 'boleto';

import { Component, ViewChild, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';

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
import { CartaoDialogComponent } from '../cartao-dialog/cartao-dialog.component';
import { app } from '../../../../server';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})

export class CheckoutComponent implements OnInit {
  
  produtos: AdminProdutos[] = [];
  itens: ItemCarrinhoMP[] = [];
  idPedidoInterno: number | undefined;
  valorTotal = 0;
  public imagemBaseUrl = 'http://localhost/neziara-sgbd/admin/uploads/';

  usuario = {
    id: 0,
    nome: "",
    email : "",
    telefone: "",
    endereco : [] as any [],
  };

  enderecos: Endereco[] =[];
  cartao = {
    numeroCartao: '',
    cvv: '',
    dataValidade: '',
  };

  mensagemSucesso = '';
  mensagemErro = '';

  formEndereco: FormGroup;
  formPagamento: FormGroup;
  formRevisao: FormGroup;

  @ViewChild(MatStepper) stepper!: MatStepper;
  
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

    this.formRevisao = this.formBuilder.group({
      email: [this.usuario.email, [Validators.required, Validators.email]],
      telefone: [this.usuario.telefone, [Validators.required, Validators.pattern(/^\d{10,11}$/)]]
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
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          endereco: []
        };
        
        this.formRevisao.patchValue({
          email: user.email,
          telefone: user.telefone
        });
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

  removerProduto(Id_Produto: number | undefined): void {
    if(!Id_Produto) {
      this.snackBar.open('ID do produto não encontrado.', 'Fechar', { duration: 3000 });
      return; // Para a execução da função aqui
    }
    const userId = this.allAuthService.getUserIdFromToken();
    
    if(!userId) {
      this.snackBar.open('Você precisa estar logado para acessar o Carrinho.', 'Fechar', {duration: 3000});
      this.router.navigate(['/home']);
      return;
      
    } else {
      this.compraService.removeCarrinho(Id_Produto, userId).subscribe({
        next: (data: AdminResponse) => {
          this.snackBar.open(data.mensagem, 'Fechar', { duration: 3000 });
          const index = this.produtos.findIndex(p => p.Id_Produto === Id_Produto);
          if(index > -1) {
            this.produtos.splice(index, 1);
          }
          this.calcularTotal();
        },
        error: (_error) => {
          this.snackBar.open('Não foi possível remover o item do Carrinho.', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  calcularTotal() {
    this.valorTotal = 0;
    this.produtos.forEach(produto =>{
      this.valorTotal += produto.Preco * produto.Quantidade!;
    });

    if(this.valorTotal == 0) {
      this.router.navigate(['/home']);
      this.snackBar.open('Seu carrinho está vazio. Adicione produtos para continuar. Redirecionando.', 'Fechar', { duration: 3000 });
    }
  }

  salvarDadosEditados(): void {
    if (this.formRevisao.valid && this.formRevisao.dirty) {
      const novosDados = this.formRevisao.value;

      //Atualiza o objeto local (para o payload final)
      this.usuario.email = novosDados.email;
      this.usuario.telefone = novosDados.telefone;

      //Chama o serviço para salvar a mudança no BD?
      //Se não salvar no BD aqui, os dados novos SÓ ESTARÃO no payload do pedido.
      
      //Reseta o estado do formulário para PRISTINE(intocado)
      this.formRevisao.markAsPristine(); 
      
      this.snackBar.open('Dados atualizados e salvos com sucesso.', 'Fechar', { duration: 3000 });
    }
  }
  

  continuarParaPagamento(): void {
    // Primeiro, verifica a validação do formulário de revisão
    if (this.formRevisao.invalid) {
      this.formRevisao.markAllAsTouched(); 
      // Exibe as mensagens de erro
      this.snackBar.open('Dados inválidos. Não é possível avançar.', 'Fechar', { duration: 3000 });
      return;
    }

    // Se o formulário estiver dirty (editado) mas o usuário não salvou as alterações, é salvo automaticamente aqui
    if (this.formRevisao.dirty) {
        this.salvarDadosEditados();
    }
    
    // Se tudo estiver OK (válido, e salvo), avance o stepper para o pagamento
     this.stepper.next();
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

    //lógica condicional para digitar/realizar o pagamento??

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
      nomeCliente: this.usuario.nome,
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

  /*iniciarPagamento():void {
    const payloadFinal = this.montarPayload();

    try {
      this.checkoutService.realizarCheckout(payloadFinal).subscribe({
        next: (resMP: any) => {
          // Exemplo: O PHP que fala com o MP deve retornar: { init_point: 'link_do_mp', idPedido: 123 }
          const linkPagamento = resMP.init_point;

          console.log('Pediddo salvo no BD com sucesso. Resposta do servidor:', resMP);
          this.snackBar.open('Pagamento iniciado com sucesso. Redirecionando...', 'Fechar', { duration: 3000 });

          if(linkPagamento) {
            this.snackBar.open('Pedido salvo e link de pagamento gerado. Redirecionando...', 'Fechar', { duration: 4000 });

            window.location.href = linkPagamento;
          } else {
            // Se o MP não retornar o link, mas o PHP deu 200 OK
            throw new Error('Link de pagamento não recebido. Verifique o PHP.');
          }
        },
        error: (error: any) => {
          console.error('Falha na Orquestração do Checkout/MP:', error);
                // Exiba a mensagem de erro do servidor, se houver
                const msg = error.error?.mensagem || 'Erro ao processar o pagamento. Tente novamente.';
                this.snackBar.open(msg, 'Fechar', { duration: 5000 });
        }
      });
    } catch (error) {
      console.error(error);
      this.snackBar.open(error instanceof Error ? error.message :'Erro ao montar os dados para o pagamento. Tente novamente.', 'Fechar', { duration: 3000 });
      return;
    }
  }*/

  //=======================================//
  //      ÁREA DO DIALOG DE CARTÃO         //
  //=======================================//
  
  abrirDialogCartao(): void {
    const dialogRef = this.dialog.open(CartaoDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cartao.cvv = result.cvv;
        this.cartao.numeroCartao = result.numeroCartao;
        this.cartao.dataValidade = result.dataValidade;
        this.iniciarPagamentoTeste();
      } //corrija depois de arrumar o dialogComponent
    });
  }
  
  enviarCartao(dadosCartao: any): any[] {
    const cartaoBackend = [];
    cartaoBackend.push(dadosCartao);
    
    return cartaoBackend;
  }
  //=======================================//
  //   FIM ÁREA DO DIALOG DE CARTÃO        //
  //=======================================//

  limparDadosCartao(): void {
    this.cartao = {
      numeroCartao: '',
      cvv: '',
      dataValidade: '',
    };
  }

  iniciarPagamentoTeste():void {
    const payloadFinal = this.montarPayload();
    const cartaoProcessado = this.enviarCartao(this.cartao); //Faça com que seja o numero vindo do dialog
    const dadosCartao = cartaoProcessado[0];

    const cartaoBackend = {
      numeroCartao: dadosCartao.numeroCartao,
      cvv: dadosCartao.cvv,
      dataValidade: dadosCartao.dataValidade,
    };

    try {
      this.checkoutService.realizarCheckoutTeste(payloadFinal, cartaoBackend).subscribe({
        next: (resTest: any) => {
          const status = resTest.status;
          const idPedido = resTest.idPedido;
          console.log('status: ', status, 'id do pedido: ', idPedido);
          
          if(status) {
            this.snackBar.open(resTest.mensagem || 'Processando....', 'Fechar', { duration: 3000 });
            
            setTimeout(() => {
              this.router.navigate([`checkout/`, status, idPedido]); 
            }, 2000);
          }

          this.limparDadosCartao();
          cartaoBackend.numeroCartao = '';
          cartaoBackend.cvv = '';
          cartaoBackend.dataValidade = '';
          cartaoProcessado.length = 0;
          console.log('numero cartao', cartaoBackend.numeroCartao, 'cvv', cartaoBackend.cvv, 'data validade', cartaoBackend.dataValidade, 'dados do cartão: ', dadosCartao[0], 'dados primordiais: ', cartaoProcessado);
        },
        error: (error: any) => {
          // Exiba a mensagem de erro do servidor, se houver
          const msg = error.error?.mensagem || 'Erro ao processar o pagamento.';
          this.snackBar.open(msg, 'Fechar', { duration: 5000 });

          this.limparDadosCartao();
          cartaoBackend.numeroCartao = '';
          cartaoBackend.cvv = '';
          cartaoBackend.dataValidade = '';
          cartaoProcessado.length = 0;
          console.log('numero cartao', cartaoBackend.numeroCartao, 'cvv', cartaoBackend.cvv, 'data validade', cartaoBackend.dataValidade, 'dados do cartão: ', dadosCartao[0], 'dados primordiais: ', cartaoProcessado);
        }
      });
    } catch (error: any) {
      console.error(error);
      this.snackBar.open(error instanceof Error ? error.message :'Erro ao montar os dados para o pagamento. Tente novamente.', 'Fechar', { duration: 3000 });
    }
      return;
  }
  //===========================//
  //  FIM do TS de Pagameento  //
  //===========================//
}