import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';
import { DadosDialogComponent } from '../dados-dialog/dados-dialog.component';
import { AvatarService } from '../../services/avatar.service';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';
import { PerfilService } from '../../services/cliente/perfil/perfil.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  usuario = {
    id: "",
    nome : "",
    email : "",
    telefone : "",
    cpf : "",
    avatar : "",
    endereco : [] as any [],
  };

  enderecos : any[] = [];
  
  constructor(
    private dialog: MatDialog,
    public avatarService: AvatarService,
    private perfilService: PerfilService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const usuario = localStorage.getItem('usuario');

    if(!usuario) {
      console.error('Email não encontrado no localStorage');
      this.router.navigate(['/login']);
      return;
    }

    const dados = JSON.parse(usuario);
    if(!dados.email) {
      console.error('Email não encontrado nos dados');
      return;
    }

    this.perfilService.obterPerfil({email: dados.email}).subscribe({
      next:(res) => {
        this.usuario = res.usuario;
        this.enderecos = res.enderecos;
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
        result.id = Date.now(); // Simula ID único
        this.enderecos.push(result);
        this.salvarPerfil();
      }
    });
  }

  editarEndereco(endereco: any): void {
    const dialogRef = this.dialog.open(EnderecoDialogComponent, {
      width: '450px',
      data: { endereco }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.enderecos.findIndex(e => e.id === endereco.id_endereco);
        if (index !== -1) {
          this.enderecos[index] = { ...result, id_endereco: endereco.id_endereco};
          this.usuario.endereco = [...this.enderecos];
          this.salvarPerfil();
        }
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
    this.perfilService.atualizarPerfil(this.usuario).subscribe({
      next: (res) => {
        console.log('Perfil atualizado com sucesso');
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('usuario');
    this.router.navigate(['/home']);
  }
}