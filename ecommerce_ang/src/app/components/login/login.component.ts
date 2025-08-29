import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/cliente/login.service';
import { AllAuthService } from '../../services/auth/all-auth.service'; 
import { firstValueFrom } from 'rxjs';

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

  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private allAuthService: AllAuthService
  ) {}

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const dados = {
      email: this.usuario.email,
      senha: this.usuario.senha,
    }

    try {
      const res: any = await firstValueFrom(this.loginService.login(dados));

      this.mensagemSucesso = res.mensagem;

      // Usar o serviço global para salvar o token.
      this.allAuthService.setToken(res.token); 

      // Redireciona para a página de perfil após o login bem-sucedido.
      this.router.navigate(['/home']);

    } catch(err: any) {
      if(err.status === 401) {
        this.mensagemErro = 'E-mail ou senha incorretos';
      } else {
        this.mensagemErro = err.error?.mensagem || 'Erro ao realizar login. Tente novamente';
      }
    }
  }
}

