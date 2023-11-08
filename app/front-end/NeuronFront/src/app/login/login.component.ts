import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean = false; 
  constructor(private router: Router, public service: UserService, private toastr:ToastrService ) { }

  ngOnInit(): void {
    this.service.loginForm.reset();
  }
  onSubmit(){
    var token = null ; 
    var refreshToken = null; 
    var user = this; 
    this.service.login().subscribe(response => {
      const token = (<any>response).Token; 
      this.service.setStorage(token); 
      user.toastr.success('Prijavljeni ste kao ' + localStorage.getItem('username'));      
    }, err => {
      console.log("Poruka:", err.error.message); 
      if(err.error.message == "Username or password is incorrect")
        user.toastr.error("Uneli ste pogrešno korisničko ime ili lozinku! "); 
      else if(err.error.message == "Username does not exist")
        user.toastr.error("Uneli ste nepostojeće korisničko ime"); 
      else
        user.toastr.error("Neuspešna registracija!"); 
    }); 
  }
}