import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminResponse } from '../../../models/admin/admin-response';
import { PerfilResponse } from '../../../models/perfil/perfil-response';
import { Usuario } from '../../../models/perfil/usuario';
import { UsuarioUpdateDTO } from '../../../models/perfil/usuario-dto';
import { Endereco } from '../../../models/endereco/endereco';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost/neziara-sgbd/perfil/';

  private getPerfilUrl = `${this.apiUrl}getPerfil.php`;
  private getEndereco = `${this.apiUrl}getEndereco.php`;

  private updateDadosPerfil = `${this.apiUrl}updateDadoPerfil.php`;
  private gerenciaEndereco = `${this.apiUrl}gerenciarEndereco.php`;

  constructor(
    private http: HttpClient,
  ) {}
  
  //obtem DADOS do perfil do usuario apenas
  obterPerfil(dados:{email:string}): Observable<PerfilResponse> {
    return this.http.post<PerfilResponse>(this.getPerfilUrl, dados);
  }

  //Obtem ENDEREÇOS do usuario
  obterEnderecos(payload: {id: number | string}): Observable<{enderecos: Endereco[]}> {
    return this.http.post<{enderecos: Endereco[]}>(this.getEndereco, payload);
  }

  //atualizar APEAS DADOS de usuario no perfil 
  atualizarPerfil(usuario: UsuarioUpdateDTO): Observable<any> {
    return this.http.post<any>(this.updateDadosPerfil, usuario);
  }

  //Lida com atualização/inserção/remoção dos dados de endereço
  gerenciarEnderecos(payload: {Cliente_Id: number | string, endereco: any[]}): Observable<any> {
    return this.http.post<any>(this.gerenciaEndereco, payload);
  }
}
