import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';

import { AdminProdutos } from '../../models/admin/produtos/admin-produtos';

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
    id: "",
    nome : "",
    email : "",
    telefone : "",
    cpf : "",
    endereco : [] as any [],
  };
  enderecos: any[] =[];

  formEndereco: FormGroup;

  constructor(
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private allAuthService:  AllAuthService,
    private router: Router,
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

    /*this.perfilService.obterPerfil({email: userData.email}).subscribe({
      next:(res) => {
        const user = res.usuario;
        this.usuario = {
          id: user.id || user.id_cliente,
          nome: user.nome || '',
          email: user.email ||'',
          telefone: user.telefone || '',
          cpf: user.cpf || '',
          endereco: res.enderecos || []
        };
        this.enderecos = [...this.usuario.endereco];
      },
      error:(err) => {
        console.error('Erro ao carregar perfil:', err)
      }
    });*/
  }

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

  editarEndereco(endereco: any): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '450px',
      data: { endereco: { ...endereco } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.id_endereco) {
        const index = this.enderecos.findIndex(e => e.id_endereco === result.id_endereco);
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

  selecionarEndereco(enderecoId: number) {
    this.formEndereco.get('idEnderecoSelecionado')?.setValue(enderecoId);

    console.log('Endereço selecionado: ', enderecoId);
  }

  salvarEnderecosCheckout(): void {
    const enderecosParaBackend = this.enderecos.map(e => ({
      id_endereco: e.id_endereco,
      rua: e.rua,
      numero: e.numero,
      cidade: e.cidade,
      estado: e.estado,
      cep: e.cep,
      complemento: e.complemento,
      bairro: e.bairro,
      principal: e.principal ? 1 : 0,
      logradouro: e.logradouro
    }));

    const usuarioParaBackend = {
      ...this.usuario,
      endereco: enderecosParaBackend
    };

    console.log('Enviando para atualizar: ', usuarioParaBackend);

    // 3. Chama o serviço de atualização (mesmo endpoint do Perfil)
    /*this.perfilService.atualizarPerfil(usuarioParaBackend).subscribe({
        next: (res) => {
            console.log('Endereços de Perfil atualizados com sucesso.', res);
            
            this.ngOnInit(); 
        },
        error: (err) => {
            console.error('Erro ao atualizar endereços:', err);
        }
    });*/
  }

}
