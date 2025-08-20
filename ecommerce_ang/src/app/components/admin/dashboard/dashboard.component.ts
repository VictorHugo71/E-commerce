import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoriaDialogComponent } from '../categoria-dialog/categoria-dialog.component';
import { CadastroProdutosService } from '../../../services/admin/produtos/cadastro-produtos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    public dialog: MatDialog,
    private categoriaService: CadastroProdutosService,
    private snackBar: MatSnackBar
  ) {}

  openCategoriaDialog(): void {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      width: '400px',
      height: '245px',
      data: { nome: ''}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.mensagemSucesso = '';
      this.mensagemErro = '';

      if(result) {
        this.categoriaService.addCategoria(result).subscribe({
          next: (res) => {
            this.mensagemSucesso = res?.mensagem || 'Categoria cadastrada com sucesso';
            console.log('Categoria adicionada: ', res);
            this.snackBar.open(res.mensagem, 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
          },
          error: (err) => {
            const mensagemErro = err.error?.mensagem || 'Erro ao adicionar categoria.';
            console.log('Erro ao adicionar categoria: ', err);
            this.snackBar.open(mensagemErro, 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }
}
