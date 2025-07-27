import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost/neziara-sgbd/login/login.php';
  
  constructor(
    private http: HttpClient
  ) { }

  login(dados:{email:string; senha:string}):
  Observable<any> {
    return this.http.post<any>(this.apiUrl, dados);
  }
}
