import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService { //Método para saber se o admin está logado e armazena os dados quando o estiver
  private readonly TOKEN_KEY = 'admin_auth_token';

  constructor(
    private router: Router
  ) { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/loginAdmin']);
  }
}

/*import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService { //Método para saber se o admin está logado e armazena os dados quando o estiver
  private readonly TOKEN_KEY = 'admin_auth_token';
  private jwtHelper = Inject(JwtHelperService);


  constructor(
    private router: Router,
  ) { }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if(token) {
      try {
        const decodedToken = this.jwtHelper.decodeToken(token);
        const roles: string[] = decodedToken.roles || [];
        return roles.includes('admin');
      } catch(error) {
        return false;
      }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/loginAdmin']);
  }
}
 */
