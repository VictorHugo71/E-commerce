import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriaDialogComponent } from '../categoria-dialog/categoria-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    public dialog: MatDialog,
  ) {}

  openCategoriaDialog(): void {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '400px',
      height: '245px',
      data: { nome: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O diálogo foi fechado');
      console.log('A categoria foi adicionada');

      //Adicionar o service para cadastrar a categoria
    });
  }
}
