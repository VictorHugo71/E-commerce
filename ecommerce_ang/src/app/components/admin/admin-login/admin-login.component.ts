import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginAdminService } from '../../../services/admin/login-admin.service';
import { firstValueFrom } from 'rxjs';
import { AdminLogin } from '../../../models/admin/admin-login';
import { AllAuthService } from '../../../services/auth/all-auth.service';

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
    private allAuthService: AllAuthService
  ) {}

  ngOnInit(): void {
  }

  async login(): Promise<void> {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    const dados = {
      email: this.admin.email,
      senha: this.admin.senha,
    }

    try {
      const res: any = await firstValueFrom(this.loginAdminService.login(dados));


      this.allAuthService.setToken(res.token); 

      this.mensagemSucesso = res.mensagem;


      this.router.navigate(['/admin/dashboard']);

    } catch(err: any) {
        this.mensagemErro = err.error?.mensagem || 'Erro ao realizar login. Tente novamente';
      }
  }
}
