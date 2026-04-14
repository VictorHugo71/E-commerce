import { Component } from '@angular/core';
import { SignupAdminService } from '../../../services/admin/signup-admin.service';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../../services/admin/auth/admin-auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-signup',
  templateUrl: './admin-signup.component.html',
  styleUrl: './admin-signup.component.scss'
})
export class AdminSignupComponent {
  admin = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };

  mensagemErro = '';
  mensagemSucesso = '';

  constructor (
    private signupAdminService: SignupAdminService,
    private adminAuthService: AdminAuthService, //usar no ngOninit
    private router: Router //usar no ngOnInit
  ) {}

  ngOninit(): void {
    
  }

  async cadastrar() {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    
    const dados = {
      nome:  this.admin.nome,
      email: this.admin.email,
      senha: this.admin.senha,
    };
    
    try {
      const res: any = await firstValueFrom(this.signupAdminService.cadastrarAdmin(dados));
      this.mensagemSucesso = res.mensagem || 'Cadastro realizado com sucesso!';
    } catch (err: any) {
      console.log(err);
      if (err.status === 409) {
        this.mensagemErro = err.error?.mensagem || 'Este e-mail já está cadastrado.';
      } else {
        this.mensagemErro = err.error?.mensagem || 'Erro ao cadastrar. Tente novamente.';
      }
    }
  }
}
