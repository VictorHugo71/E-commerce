import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrl: './avatar-dialog.component.scss'
})
export class AvatarDialogComponent {
  avatarMap: { [key: string]: string } = {
    'avatar01.png': 'Guerreiro Azul',
    'avatar02.png': 'Exploradora Lunar',
    'avatar03.png': 'Ciborgue Dourado',
    'avatar04.png': 'Fada Digital',
    'avatar05.png': 'Cachorrão',
    'avatar06.png': 'Lutador Foda'
  };
  
  avatares = Object.keys(this.avatarMap); // ['avatar01.png', ...]
  
  constructor (
    private dialogRef: MatDialogRef<AvatarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selecionarAvatar(avatar: string) {
    this.dialogRef.close(avatar); // retorna o avatar escolhido
  }
}
