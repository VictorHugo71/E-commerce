import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminLogin } from '../../models/admin/admin-login';
import { AdminResponse } from '../../models/admin/admin-response';

@Injectable({
  providedIn: 'root'
})
export class LoginAdminService {
  private apiUrl = 'http://localhost/neziara-sgbd/admin/login/admin-login.php';

  constructor(
    private http: HttpClient
  ) { }

  login(dados: AdminLogin): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(this.apiUrl, dados);
  }
}
