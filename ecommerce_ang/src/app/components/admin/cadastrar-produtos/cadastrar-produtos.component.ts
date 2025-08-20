import { Component, OnInit } from '@angular/core';
import { AdminProdutos } from '../../../models/admin/produtos/admin-produtos';
import { Categoria } from '../../../models/admin/produtos/categorias';
import { CadastroProdutosService } from '../../../services/admin/produtos/cadastro-produtos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cadastrar-produtos',
  templateUrl: './cadastrar-produtos.component.html',
  styleUrl: './cadastrar-produtos.component.scss'
})
export class CadastrarProdutosComponent implements OnInit {
  produto: AdminProdutos = {
    Nome_Produto: '',
    Preco: 0.0,
    Descricao: '',
    Id_Categoria: 0,
    Estoque: 0,
    Status: false,
  };

  categorias: Categoria[] = [];

  mensagemSucesso = '';
  mensagemErro = '';

  selectedFile: File | null = null;

  constructor(
    private produtoService: CadastroProdutosService,
  ) {}

  ngOnInit(): void {
    this.carregarCategorias();
  }

  async carregarCategorias(): Promise<void> {
    try{
      this.categorias = await firstValueFrom(this.produtoService.getCategoria());

    } catch(error: any) {
      this.mensagemErro = 'Erro ao carregar categorias.';
    }
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
    formData.append('nome', this.produto.Nome_Produto);
    formData.append('descricao', this.produto.Descricao);
    formData.append('preco', this.produto.Preco.toString()); // Converte para string
    formData.append('estoque', this.produto.Estoque.toString());
    formData.append('categoria', this.produto.Id_Categoria.toString());
    formData.append('imagem', this.selectedFile, this.selectedFile.name);
    formData.append('status', this.produto.Status ? '1' : '0');
    

    try {
      const res = await firstValueFrom(this.produtoService.addProduto(formData));
      this.mensagemSucesso = res.mensagem;

      this.produto = {Nome_Produto: '', Preco: 0.0, Descricao: '', Id_Categoria: 0, Estoque: 0, Status: false};
      this.selectedFile = null;

    } catch(error: any) {
        this.mensagemErro = error.error?.mensagem || 'Erro ao cadastrar o produto. Tente novamente.';
    }
  }

  cancelarCadastro(): void {
    this.produto = {Nome_Produto: '', Preco: 0.0, Descricao: '', Id_Categoria: 0, Estoque: 0, Status: false};
    console.log('Cadastro de produto cancelado');
  }
}
