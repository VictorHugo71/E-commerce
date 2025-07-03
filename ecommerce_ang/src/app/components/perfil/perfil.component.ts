import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    avatar : "",
  }
  
  avatarMap: { [key: string]: string } = {
    'avatar01.png': 'Guerreiro Azul',
    'avatar02.png': 'Flor Imperial',
    'avatar03.png': 'Estrela do Norte',
    // adicione mais conforme necessário
  };

  get nomeAvatar(): string {
    return this.avatarMap[this.usuario.avatar] || this.usuario.avatar;
  }

  constructor(private dialog: MatDialog) {}
  avatarKey = 0;

  abrirDialogAvatar(): void {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      width: '400px',
      data: { avatar: this.usuario.avatar }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuario.avatar = result;
        this.avatarKey++;
      }
    });
  }
}
