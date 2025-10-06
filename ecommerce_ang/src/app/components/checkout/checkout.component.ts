import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';


import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';

import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';
import { Endereco } from '../../models/endereco/endereco';
import { AdminResponse } from '../../models/admin/admin-response';

import { AllAuthService } from '../../services/auth/all-auth.service';
import { PerfilService } from '../../services/cliente/perfil/perfil.service';

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
    id: 0,
    email : "",
    endereco : [] as any [],
  };
  enderecos: Endereco[] =[];

  mensagemSucesso = '';
  mensagemErro = '';

  formEndereco: FormGroup;

  constructor(
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private allAuthService:  AllAuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.formEndereco = this.formBuilder.group({
      idEnderecoSelecionado: [null as number | null, Validators.required]
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
          email : "",
          endereco: []
        };
        this.obterEnderecos();
      },
      error:(err) => {
        console.error('Erro ao carregar perfil:', err)
      }
    });
  }

  obterEnderecos(): void {
    if(!this.usuario.id) return;

    this.perfilService.obterEnderecos({id: this.usuario.id}).subscribe({
      next: (res: any) => {
        this.usuario.endereco = res.enderecos || [];
        this.enderecos = [...this.usuario.endereco];
      },
      error: (err: any) => {
        this.snackBar.open('Erro ao carregar dados de Endereço.', 'Fechar', {duration: 3000});
      }
    });
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
        } else {
          this.enderecos.push(result);
        }
        this.usuario.endereco = [...this.enderecos];
        this.salvarEnderecosCheckout();
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

}
