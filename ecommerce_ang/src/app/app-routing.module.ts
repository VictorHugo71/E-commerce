import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { DetalheProdutoComponent } from './components/detalhe-produto/detalhe-produto.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {path: 'home', component: WelcomeComponent},
  {path: 'produto/:id,', component: DetalheProdutoComponent} //tem que fazer esta parte ainda, depois que fizer o back
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
