import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// IMPORT DOS GUARDS
import { authGuard } from './guards/auth.guard'; //guard Cliente
import { adminGuard } from './guards/admin/admin.guard';//guard Admin
import { publicGuard } from './guards/public/public-guard.guard';

//Rotas Publicas
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { InputComponent} from './components/input/input.component';

//Rota Privada de Clientee
import { PerfilComponent } from './components/perfil/perfil.component';
import { ListaDesejoComponent } from './components/lista-desejo/lista-desejo.component';
import { FinalizarCompraComponent } from './pages/finalizar-compra/finalizar-compra.component';

//Rota Privada de Admin
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AdminSignupComponent } from './components/admin/admin-signup/admin-signup.component';
import { GerenciarProdutosComponent } from './components/admin/gerenciar-produtos/gerenciar-produtos.component';
import { CadastrarProdutosComponent } from './components/admin/cadastrar-produtos/cadastrar-produtos.component';


const routes: Routes = [
  // Redireciona a rota base para a página inicial
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: WelcomeComponent },

  // Rotas de autenticação (usando o AuthLayoutComponent)
  { path: '', component: AuthLayoutComponent, children: [
    { path: 'login', component: LoginComponent, canActivate: [publicGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [publicGuard] },
    { path: 'admin/login', component: AdminLoginComponent, canActivate: [publicGuard] },
    { path: 'admin/signup', component: AdminSignupComponent, canActivate:[adminGuard] },
  ]},

  //Rotas Protegidas de Cliente
  {path: 'perfil', component: PerfilComponent, canActivate: [authGuard]},
  {path: 'listadesejo', component: ListaDesejoComponent, canActivate: [authGuard]},
  {path: 'finalizar', component: FinalizarCompraComponent, canActivate: [authGuard]},
  
  // Rotas de produto (públicas)
  {path: 'produto/:id', component: ProdutoComponent}, //tem que fazer esta parte ainda, depois que fizer o back
  
  // Rotas de administrador, protegidas pelo adminGuard
  // Todas as rotas dentro deste bloco só poderão ser acessadas se o adminGuard permitir
  {
    path: 'admin',
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'gerenciar-produtos', component: GerenciarProdutosComponent },
      { path: 'gerenciar-produtos/adicionar', component: CadastrarProdutosComponent },
      // Adicione outras rotas de admin aqui
    ]
  },
  
  {path: 'input', component: InputComponent},

  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
