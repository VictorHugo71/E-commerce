import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dados-dialog',
  templateUrl: './dados-dialog.component.html',
  styleUrl: './dados-dialog.component.scss'
})
export class DadosDialogComponent {
  dadosEditados: any;

  constructor(
    public dialogRef: MatDialogRef<DadosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dadosOriginais: any
  ) {
    this.dadosEditados = { ...dadosOriginais };
  }

  salvar(): void {
    this.dialogRef.close(this.dadosEditados);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
