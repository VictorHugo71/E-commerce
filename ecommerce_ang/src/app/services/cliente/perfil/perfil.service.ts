import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost/neziara-sgbd/perfil/';
  private getPerfilUrl = `${this.apiUrl}getPerfil.php`;
  private getEndereco = `${this.apiUrl}`;
  private updateDadosPerfil = `${this.apiUrl}updateDadosPerfil.php`;
  private gerenciaEndereco = `${this.apiUrl}`;

  constructor(
    private http: HttpClient,
  ) {}
  
  //obtem DADOS do perfil do usuario apenas
  obterPerfil(dados:{email:string}): Observable<any> {
    return this.http.post<any>(this.getPerfilUrl, dados);
  }

  //Apenas da um get nos ENDEREÇOS do usuario
  obterEndereco() {

  }

  //atualizar APEAS DADOS de usuario no perfil 
  atualizarPerfil(usuario:any): Observable<any> {
    return this.http.post<any>(this.updateDadosPerfil, usuario);
  }

  //Lida com atualização/inserção/remoção dos dados de endereço
  atualizaEndereco() {

  }


}
