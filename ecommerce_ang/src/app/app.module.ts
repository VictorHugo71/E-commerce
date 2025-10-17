import { NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { isPlatformBrowser } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'; // útil para produto
import { MatMenuModule} from '@angular/material/menu';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { ReactiveFormsModule } from '@angular/forms';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { InputComponent } from './components/input/input.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AvatarDialogComponent } from './components/avatar-dialog/avatar-dialog.component';
import { DadosDialogComponent } from './components/dados-dialog/dados-dialog.component';
import { EnderecoDialogComponent } from './components/endereco-dialog/endereco-dialog.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { ListaDesejoComponent } from './components/lista-desejo/lista-desejo.component';
import { ProdutoComponent } from './pages/produto/produto.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminSignupComponent } from './components/admin/admin-signup/admin-signup.component';
import { CadastrarProdutosComponent } from './components/admin/cadastrar-produtos/cadastrar-produtos.component';
import { GerenciarProdutosComponent } from './components/admin/gerenciar-produtos/gerenciar-produtos.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { CategoriaDialogComponent } from './components/admin/categoria-dialog/categoria-dialog.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export function tokenGetter() {
  if (isPlatformBrowser(PLATFORM_ID)) {
    return localStorage.getItem('auth_token');
  }
  return null;
}

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    SignupComponent,
    AuthLayoutComponent,
    InputComponent,
    PerfilComponent,
    AvatarDialogComponent,
    DadosDialogComponent,
    EnderecoDialogComponent,
    CarrinhoComponent,
    ListaDesejoComponent,
    ProdutoComponent,
    AdminLoginComponent,
    AdminSignupComponent,
    CadastrarProdutosComponent,
    GerenciarProdutosComponent,
    DashboardComponent,
    CategoriaDialogComponent,
    CheckoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    FormsModule,
    MatDialogModule,
    MatOption,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatStepperModule,
    ReactiveFormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [
          'localhost',
          
        ],
        disallowedRoutes: [ //tem que ser rotas do back-end
          'http://localhost/neziara-sgbd/login.php',
          'http://localhost/neziara-sgbd/admin/admin-login.php'
        ],
      },
    }),
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
