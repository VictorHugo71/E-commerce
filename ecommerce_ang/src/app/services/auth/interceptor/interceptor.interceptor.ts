import { HttpInterceptorFn, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { AllAuthService } from '../all-auth.service';

@Injectable()

export class InterceptorInterceptor implements HttpInterceptor {
  constructor(private authService: AllAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {  
      const clonedRequest = request.clone ({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log('Token adicionado ao cabeçalho:', token); //Remover em produção
      return next.handle(clonedRequest);
    } else {
      return next.handle(request);
    }
  }
}