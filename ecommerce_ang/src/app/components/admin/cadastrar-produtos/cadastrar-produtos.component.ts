import { Component, OnInit } from '@angular/core';
import { AdminProdutos } from '../../../models/admin/produtos/admin-produtos';
import { CadastroProdutosService } from '../../../services/admin/produtos/cadastro-produtos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cadastrar-produtos',
  templateUrl: './cadastrar-produtos.component.html',
  styleUrl: './cadastrar-produtos.component.scss'
})
export class CadastrarProdutosComponent /*implements OnInit*/ {
  produto: AdminProdutos = {
    nome: '',
    preco: 0.0,
    descricao: '',
    categoria: '',
    estoque: 0,
    status: false,
  };

  mensagemSucesso = '';
  mensagemErro = '';

  selectedFile: File | null = null;

  constructor(
    private produtoService: CadastroProdutosService,
  ) {}

  ngOnInit(): void {

  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  async cadastrarProduto(): Promise<void> {
    this.mensagemSucesso = '';
    this.mensagemErro ='';

    if(!this.selectedFile) {
      this.mensagemErro = 'Por favor selecione uma imgem.';
      return;
    }

    const formData = new FormData();
    formData.append('nome', this.produto.nome);
    formData.append('descricao', this.produto.descricao);
    formData.append('preco', this.produto.preco.toString()); // Converte para string
    formData.append('estoque', this.produto.estoque.toString());
    formData.append('categoria', this.produto.categoria);
    formData.append('imagem', this.selectedFile, this.selectedFile.name);
    formData.append('status', this.produto.status.toString());

    try {
      const res = await firstValueFrom(this.produtoService.addProduto(this.produto));
      this.mensagemSucesso = res.mensagem;

      this.produto = {nome: '', preco: 0.0, descricao: '', categoria: '', estoque: 0, status: false};
      this.selectedFile = null;

    } catch(error: any) {
        this.mensagemErro = error.error?.mensagem || 'Erro ao cadastrar o produto. Tente novamente.';
    }
  }

  cancelarCadastro(): void {
    this.produto = {nome: '', preco: 0.0, descricao: '', categoria: '', estoque: 0, status: false};
    console.log('Cadastro de produto cancelado');
  }
}
