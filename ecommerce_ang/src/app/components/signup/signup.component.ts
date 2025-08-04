import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CadastroService } from '../../services/cliente/cadastro.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit{
  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private router: Router,
    private clienteService: CadastroService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if(this.authService.estaLogado()) {
      this.router.navigate(['/perfil']);
    }
  }

  cadastrar() {
    if (this.usuario.senha !== this.usuario.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    const dados = {
      nome: this.usuario.nome,
      email: this.usuario.email,
      senha: this.usuario.senha
    };

    this.clienteService.cadastrarCliente(dados).subscribe({
      next: (res) => {
        this.mensagemSucesso = res.mensagem || 'Cadastro Realizado com Sucesso!';
        this.mensagemErro = '';
      },
      error: (err) => {
        if (err.status === 409) {
          this.mensagemErro = 'Este e-mail já está cadastrado';
        } else {
          this.mensagemErro = 'Erro ao cadastrar. Tente novamente';
        }
        this.mensagemSucesso = '';
      }
    });
  }
}
