import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private apiUrl = 'http://localhost/neziara-sgbd/cadastro/cadastro.php'

  constructor(private http: HttpClient) { }

  cadastrarCliente(dados: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, dados);
  }
}