import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { ListaDesejoComponent } from './components/lista-desejo/lista-desejo.component';
import { FinalizarCompraComponent } from './pages/finalizar-compra/finalizar-compra.component';
import { InputComponent} from './components/input/input.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: WelcomeComponent},
  {path: '', component: AuthLayoutComponent, children: [
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent}
  ]
  },
  {path: 'perfil', component: PerfilComponent, canActivate: [authGuard]},
  {path: 'produto/:id', component: ProdutoComponent}, //tem que fazer esta parte ainda, depois que fizer o back
  {path: 'listadesejo', component: ListaDesejoComponent, canActivate: [authGuard]},
  {path: 'finalizar', component: FinalizarCompraComponent, canActivate: [authGuard]},
  {path: 'input', component: InputComponent}, //tem que fazer esta parte ainda, depois que fizer o back

  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
