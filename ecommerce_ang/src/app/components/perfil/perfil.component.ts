import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { DadosDialogComponent } from '../dados-dialog/dados-dialog.component';

import { AvatarService } from '../../services/avatar.service';
import { PerfilService } from '../../services/cliente/perfil/perfil.service';
import { AllAuthService } from '../../services/auth/all-auth.service'; 

import { Endereco } from '../../models/endereco/endereco';
import { Usuario } from '../../models/perfil/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {//falta tipar o usuario
  usuario = { //Não tranormar em um array, isto implica que varios usuarios estão logados, desta forma representa O usuário logado, um(1) único objeto
    id: "",
    nome : "",
    email : "",
    telefone : "",
    cpf : "",
    avatar : "",
    endereco : [] as any [],
  };

  //Cópia dos endeereços para ser usada na iteração do *ngFor do front-end
  enderecos : any[] = []; //falta tipar o endereco
  
  constructor(
    private dialog: MatDialog,
    public avatarService: AvatarService,
    private perfilService: PerfilService,
    private allAuthService: AllAuthService,
    private router: Router
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
          endereco: res.enderecos || []
        };
        this.enderecos = [...this.usuario.endereco];
      },
      error:(err) => {
        console.error('Erro ao carregar perfil:', err)
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
        this.salvarPerfil();
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
        this.salvarPerfil();
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
        this.salvarPerfil();
      }
    });
  }

  editarEndereco(endereco: any): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '450px',
      data: { endereco: { ...endereco } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.enderecos.findIndex(e => e.id_endereco === result.id_endereco);
        if (index !== -1) {
          this.enderecos[index] = result;
        } else {
          this.enderecos.push(result);
        }
        this.usuario.endereco = [...this.enderecos];
        this.salvarPerfil();
      }
    });
  }

  removerEndereco(id: number): void {
    this.enderecos = this.enderecos.filter(e => e.id_endereco !== id);
    this.usuario.endereco = [...this.enderecos];
    this.salvarPerfil();
  }

  definirComoPrincipal(id: number): void {
    this.enderecos.forEach(e => e.principal = false);
    const escolhido = this.enderecos.find(e => e.id_endereco === id);
    if (escolhido) {
      escolhido.principal = true;
      this.usuario.endereco = [...this.enderecos];
      this.salvarPerfil();
    }
  }

  salvarPerfil(): void {
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

    this.perfilService.atualizarPerfil(usuarioParaBackend).subscribe({
      next: (res) => {
        console.log('Perfil atualizado com sucesso', res);
        this.ngOnInit(); 
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
      }
    });
  }

  logout(): void {
    this.allAuthService.logout();
  }
}