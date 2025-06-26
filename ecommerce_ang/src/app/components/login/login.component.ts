import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = {
    email: '',
    senha: ''
  };

  constructor(private router: Router) {}


  login() {
    if (this.usuario.email && this.usuario.senha) {
      alert('Login realizado!');
      this.router.navigate(['/']); // ✅ Redireciona para a home
    }
  }
}

