import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { EnderecoDialogComponent } from '../endereco-dialog/endereco-dialog.component';
import { DadosDialogComponent } from '../dados-dialog/dados-dialog.component';
import { AvatarService } from '../../services/avatar.service';
import { AvatarDialogComponent } from '../avatar-dialog/avatar-dialog.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  usuario = {
    nome : "",
    email : "",
    telefone : "",
    cpf : "",
    endereco : "",
    avatar : "",
  };

  enderecos : 
    any[] = [];
  
  constructor(
    private dialog: MatDialog,
    public avatarService: AvatarService
  ) {}

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
        const index = this.enderecos.findIndex(e => e.id === endereco.id);
        if (index !== -1) {
          this.enderecos[index] = { ...result, id: endereco.id };
        }
      }
    });
  }

  removerEndereco(id: number): void {
    this.enderecos = this.enderecos.filter(e => e.id !== id);
  }

  definirComoPrincipal(id: number): void {
    this.enderecos.forEach(e => e.principal = false);
    const escolhido = this.enderecos.find(e => e.id === id);
    if (escolhido) {
      escolhido.principal = true;
    }
  }
}