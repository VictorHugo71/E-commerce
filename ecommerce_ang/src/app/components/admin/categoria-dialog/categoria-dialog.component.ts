import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface CategoriaDialogData {
  nome: string;
}

@Component({
  selector: 'app-categoria-dialog',
  templateUrl: './categoria-dialog.component.html',
  styleUrl: './categoria-dialog.component.scss'
})
export class CategoriaDialogComponent {
  categoria: CategoriaDialogData = { nome: ''};

  constructor(
    public dialogRef: MatDialogRef<CategoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CategoriaDialogData
  ) {}

  onClick(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {}
}
