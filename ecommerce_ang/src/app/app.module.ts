import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card'; // útil para produto
import { MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { FormsModule } from '@angular/forms';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { HomeComponent } from './components/home/home.component';
import { DetalheProdutoComponent } from './components/detalhe-produto/detalhe-produto.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { InputComponent } from './components/input/input.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { AvatarDialogComponent } from './components/avatar-dialog/avatar-dialog.component';
import { DadosDialogComponent } from './components/dados-dialog/dados-dialog.component';
import { EnderecoDialogComponent } from './components/endereco-dialog/endereco-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WelcomeComponent,
    DetalheProdutoComponent,
    LoginComponent,
    SignupComponent,
    AuthLayoutComponent,
    InputComponent,
    PerfilComponent,
    AvatarDialogComponent,
    DadosDialogComponent,
    EnderecoDialogComponent,
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
    MatOption
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
