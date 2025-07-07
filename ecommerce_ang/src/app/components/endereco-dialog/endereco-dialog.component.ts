import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-endereco-dialog',
  templateUrl: './endereco-dialog.component.html',
  styleUrls: ['./endereco-dialog.component.scss']
})
export class EnderecoDialogComponent {
  endereco: any;

  constructor(
    public dialogRef: MatDialogRef<EnderecoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Se for edição, carrega os dados. Se for novo, cria em branco
    this.endereco = data?.endereco
      ? { ...data.endereco }
      : {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
          principal: false
        };
  }

  salvar(): void {
    this.dialogRef.close(this.endereco);
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
