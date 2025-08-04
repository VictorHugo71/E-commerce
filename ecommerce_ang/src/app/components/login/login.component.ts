import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/cliente/login.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  usuario = {
    email: '',
    senha: ''
  };

  MensagemErro = '';
  MensagemSucesso = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if(this.authService.estaLogado()) {
      this.router.navigate(['/perfil']);
    }
  }

  login(): void {
    this.loginService.login(this.usuario).subscribe({
      next:(res) => {
        this.MensagemSucesso = res.mensagem;
        this.MensagemErro = '';

        //salvar usuario logado localmente
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this.authService.setUsuario(res.usuario);

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

