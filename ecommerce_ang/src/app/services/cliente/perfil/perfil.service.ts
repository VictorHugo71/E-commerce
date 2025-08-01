import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private perfilUrl = 'http://localhost/neziara-sgbd/perfil/perfil.php';
  private atualizarUrl = 'http://localhost/neziara-sgbd/perfil/atualiza_perfil.php';

  constructor(
    private http: HttpClient,
  ) {}

  obterPerfil(dados:{email:string}): Observable<any> {
    return this.http.post<any>(this.perfilUrl, dados);
  }

  atualizarPerfil(usuario:any): Observable<any> {
    return this.http.post<any>(this.atualizarUrl, usuario);
  }
}
