import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './views/register/register.component';
import { LoginComponent } from './views/login/login.component';
import { NavbarComponent } from './views/navbar/navbar.component';
const routes: Routes = [
  {
    path : '',
    component : NavbarComponent,
    children : [{
      //Login route
    path : 'login',
    component : LoginComponent
   },
   {
    //Register route
  path : 'register',
  component : RegisterComponent
  }]
  },
  
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
