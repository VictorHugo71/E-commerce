import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminResponse } from '../../models/admin/admin-response';
import { AdminCadastro } from '../../models/admin/admin-cadastro';

@Injectable({
  providedIn: 'root'
})
export class SignupAdminService {
  private apiUrl = ''

  constructor(
    private http: HttpClient
  ) { }

  cadastrarAdmin(dados: AdminCadastro): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(this.apiUrl, dados);
  }
}
