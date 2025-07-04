import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
    avatar : "",
  }
  
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
}