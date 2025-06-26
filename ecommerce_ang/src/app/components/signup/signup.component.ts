import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
};

constructor(private router: Router) {}

  cadastrar() {
    if (this.usuario.senha !== this.usuario.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    // Aqui você vai chamar o serviço para enviar os dados ao backend (PHP, API, etc.)
    // Exemplo:
    // this.authService.cadastrar(this.usuario).subscribe(...)

    console.log('Usuário cadastrado:', this.usuario);

    // Simula sucesso e redireciona para login
    alert('Cadastro realizado com sucesso!');
    this.router.navigate(['/login']);
  }
}
