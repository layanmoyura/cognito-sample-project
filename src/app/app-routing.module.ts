import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { LogoutComponent } from './logout/logout.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path:'',redirectTo:'/signup',pathMatch:'full'},
  {path:'signup',component:SignUpComponent},
  {path: 'login' , component:LogInComponent},
  {path: 'logout' , component:LogoutComponent},
  {path: 'home' , component:HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
