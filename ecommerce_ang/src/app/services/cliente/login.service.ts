import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminResponse } from '../../models/admin/admin-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost/neziara-sgbd/login/login.php';
  
  constructor(
    private http: HttpClient
  ) { }

  login(dados:{email:string; senha:string}): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(this.apiUrl, dados);
  }
}
