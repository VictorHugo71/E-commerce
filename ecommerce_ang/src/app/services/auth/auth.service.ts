import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioLogado:any = null;

  setUsuario(usuario:any): void {
    this.usuarioLogado = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): any {
    const usuarioJson = localStorage.getItem('usuario');
    return usuarioJson? JSON.parse(usuarioJson):null;
  }

  getEmail(): string | null {
    const usuario = localStorage.getItem('usuario');
    if(!usuario) return null;

    const dados = JSON.parse(usuario);
    return dados.email || null;

    
  }

  estaLogado(): boolean {
    return !!localStorage.getItem('usuario');
  }

  logout(): void {
    this.usuarioLogado = null;
    localStorage.removeItem('usuario');
  }
  
  constructor() { }
}
