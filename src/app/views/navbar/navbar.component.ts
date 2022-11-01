import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  display : any;
  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  login(){
      this.display = 'login';
  }

  signup(){
    this.display = 'signup';
  }

  closeModel(value:any){
    this.display = '';
  }
}
