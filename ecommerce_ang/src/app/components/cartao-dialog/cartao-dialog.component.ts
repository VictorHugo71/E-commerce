import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cartao-dialog',
  templateUrl: './cartao-dialog.component.html',
  styleUrl: './cartao-dialog.component.scss'
})
export class CartaoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CartaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {} //corrige depois para funcionar

  cartao = {
    numeroCartao: '',
    cvv: '',
    dataValidade: '',
  };

  salvar(): void {
    this.dialogRef.close(this.cartao);
    }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
