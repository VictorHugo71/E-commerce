import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AllAuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private jwtHelper = inject(JwtHelperService);

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.data.id;
    } catch (error) {
      return null;
    }
  }

  public getUserDataFromToken(): { id: number | null, nome: string | null, email: string | null } {
    const token = this.getToken();
    if (!token) {
      return { id: null, nome: null, email: null };
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      
      return {
        id: decodedToken.data.id,
        nome: decodedToken.data.nome,
        email: decodedToken.data.email
      };
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return { id: null, nome: null, email: null };
    }
  }

  private getRolesFromToken(): string[] {
    const token = this.getToken(); // Use o método getToken para ler do localStorage
    if (!token) {
      return [];
    }
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      
      // CORREÇÃO: Acessar a propriedade 'papel' dentro do objeto 'data'
      const role = decodedToken.data.papel;
      
      if (role) {
        return [role]; // Retorna o papel em um array
      }
      
      return [];
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return [];
    }
  }

  isAdmin(): boolean {
    if(!this.isLoggedIn()) {
      return false;
    }
    const roles = this.getRolesFromToken();
    return roles.includes('admin');
  }
  
  isClient(): boolean {
    if(!this.isLoggedIn()) {
      return false;
    }
    const roles = this.getRolesFromToken();
    return roles.includes('cliente');
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
 
