import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  display : any;
  logout : boolean = false;
  authName : String = '';
  id :any;
  constructor(private authService : AuthService, private notification : NotificationService) { }

  ngOnInit(): void {
   this.userData();
    
  }

  userData(){
    let userData = JSON.parse(localStorage.getItem('ART')!);
    if(userData){
      this.logout = true;
      this.id = jwt_decode(userData);
      this.authService.getUser(this.id._id).subscribe(response => {
        if(response.success){
          this.authName = response.data.user.username.userName;
          this.logout = true;
        }
      },err => {
        this.notification.showError(err.error.message, "");
      }) 
    }
    else{
      this.logout = false;
    }
  }

  logoutUser(){
    let user = JSON.parse(localStorage.getItem('ART')!);
    const userToken = user.ART;
    this.authService.logOut(userToken).subscribe(res => {
      if(res.success){
        this.notification.showSuccess(res.message,''); 
        localStorage.removeItem('ART');
      }else{
        this.notification.showSuccess(res.message,''); 
      }
    },err => {
      this.notification.showError(err.error.message, "");
    })

    this.logout = false;
    
  }
  login(){
      this.display = 'login';
  }

  signup(){
    this.display = 'signup';
  }

  closeModel(value:any){
    if(value == 'login'){
      this.logout = true;
      this.userData();
    }
    this.display = '';
  }
}
