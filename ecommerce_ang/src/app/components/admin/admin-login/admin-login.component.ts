import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAdminService } from '../../../services/admin/login-admin.service';
import { firstValueFrom } from 'rxjs';
import { AdminLogin } from '../../../models/admin/admin-login';
import { AdminAuthService } from '../../../services/admin/auth/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit{
  admin: AdminLogin = {
    email: '',
    senha: '',
  };

  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private loginAdminService: LoginAdminService,
    private router: Router,
    private adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    if(this.adminAuthService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  async login() {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const dados = {
      email: this.admin.email,
      senha: this.admin.senha,
    }

    try {
      const res: any = await firstValueFrom(this.loginAdminService.login(dados));

      //this.adminAuthService.setToken(res.token); Se o php retornar um token

      this.mensagemSucesso = res.mensagem;

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
