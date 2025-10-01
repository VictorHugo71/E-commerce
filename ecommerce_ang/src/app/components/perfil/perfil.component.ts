import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { DadosDialogComponent } from '../dados-dialog/dados-dialog.component';

import { AvatarService } from '../../services/avatar.service';
import { PerfilService } from '../../services/cliente/perfil/perfil.service';
import { AllAuthService } from '../../services/auth/all-auth.service'; 

import { Endereco } from '../../models/endereco/endereco';
import { Usuario } from '../../models/perfil/usuario';
import { UsuarioUpdateDTO } from '../../models/perfil/usuario-dto';
import { AdminResponse } from '../../models/admin/admin-response';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  usuario: Usuario = { //Não transformar em um array, isto implica que varios usuarios estão logados, desta forma representa O usuário logado, um(1) único objeto
    id: 0,
    nome : "",
    email : "",
    telefone : "",
    cpf : "",
    avatar : "",
    endereco: [],
  };

  //Cópia dos endereços para ser usada na iteração do *ngFor do front-end
  enderecos: Endereco[] = []; 

  mensagemSucesso = '';
  mensagemErro = '';
  
  constructor(
    private dialog: MatDialog,
    public avatarService: AvatarService,
    private perfilService: PerfilService,
    private allAuthService: AllAuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

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
          id: user.id || user.id_cliente,
          nome: user.nome || '',
          email: user.email ||'',
          telefone: user.telefone || '',
          cpf: user.cpf || '',
          avatar: user.avatar || '',
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
  

  get nomeAvatar(): string {
    return this.avatarService.getNomeLegal(this.usuario.avatar);
  }

  abrirDialogAvatar(): void {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      width: '400px',
      data: { avatar: this.usuario.avatar }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuario.avatar = result;
        this.salvarDadosPessoais();
      }
    });
  }

  abrirDialogDados() {
    const dialogRef = this.dialog.open(DadosDialogComponent, {
      width: '400px',
      data: { ...this.usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.usuario = { ...result };
        this.salvarDadosPessoais();
      }
    });
  }

  abrirDialogNovoEndereco(): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enderecos.push(result);
        this.usuario.endereco = [...this.enderecos];
        this.salvarEndereco();
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
        this.salvarEndereco();
      }
    });
  }

  removerEndereco(id: number): void {
    this.enderecos = this.enderecos.filter(e => e.idEndereco !== id);
    this.usuario.endereco = [...this.enderecos];
    this.salvarEndereco();
  }

  definirComoPrincipal(id: number): void {
    this.enderecos.forEach(e => e.principal = false);
    const escolhido = this.enderecos.find(e => e.idEndereco === id);
    if (escolhido) {
      escolhido.principal = true;
      this.usuario.endereco = [...this.enderecos];
      this.salvarEndereco();
    }
  }

  salvarDadosPessoais(): void {
    const dadosPessoaisBackend: UsuarioUpdateDTO = {
      id: this.usuario.id,
        nome: this.usuario.nome,
        email: this.usuario.email,
        telefone: this.usuario.telefone,
        cpf: this.usuario.cpf,
        avatar: this.usuario.avatar
    };

    this.perfilService.atualizarPerfil(dadosPessoaisBackend).subscribe({
      next: (res: AdminResponse) => {
        this.mensagemSucesso = res.mensagem || 'Dados pessoais atualizados com suceesso';
        this.snackBar.open(this.mensagemSucesso, 'Fechar', {duration: 3000});
      },
      error: (err: AdminResponse) => {
        this.mensagemErro = err.mensagem || 'Falha ao atualizar dados pessoais';
      }
    });
  }

  salvarEndereco(): void {
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