import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/cliente/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  usuario = {
    email: '',
    senha: ''
  };

  MensagemErro = '';
  MensagemSucesso = '';

  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}


  login(): void {
    this.loginService.login(this.usuario).subscribe({
      next:(res) => {
        this.MensagemSucesso = res.mensagem;
        this.MensagemErro = '';

        //salvar usuario logado localmente
        localStorage.setItem('usuario', JSON.stringify(res.usuario));

        //redireciona apos o login
        this.router.navigate(['/home']);
      },
      error:(err) => {
        this.MensagemSucesso = "";
        if(err.status === 401) {
          this.MensagemErro = 'Email ou Senha inválidos';
        } else {
          this.MensagemErro = 'Erro ao tentar fazer login';
        }
      }
    });
  }
}

