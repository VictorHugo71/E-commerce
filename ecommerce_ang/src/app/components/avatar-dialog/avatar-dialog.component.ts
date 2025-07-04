import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-avatar-dialog',
  templateUrl: './avatar-dialog.component.html',
  styleUrl: './avatar-dialog.component.scss'
})

export class AvatarDialogComponent {
  avatarList: { arquivo: string, nome: string }[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AvatarDialogComponent>,
    public avatarService: AvatarService
  ) {
    this.avatarList = this.avatarService.getTodosAvatares();
  }

  selecionarAvatar(arquivo: string): void {
    this.dialogRef.close(arquivo);
  }
}
