import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private router:Router, public service: UserService, private toastr:ToastrService ) { }

  ngOnInit(): void {
    this.service.formModel.reset();
  }
  onSubmit(){
    var token = null ; 
    var user = this; 
    const response = this.service.register().subscribe({
      next(res:any) {
        console.log(res.Succeeded); 
        if(res.Succeeded){
          user.service.loginForm.value.UserName = user.service.formModel.value.UserName; 
          user.service.loginForm.value.Password = user.service.formModel.value.Passwords.Password; 
          user.service.login().subscribe(response => {
            const token = (<any>response).Token; 
            user.service.setStorage(token); 
            user.toastr.success('Prijavljeni ste kao ' + localStorage.getItem('username'));
                
          }, err => {
            console.log(err); 
            user.toastr.error("Uneli ste pogrešno korisničko ime ili lozinku! ");
          }); 
        }
      },
      error(msg) {
        switch (msg.code) {
          case "DuplicateUserName":
            user.toastr.error('Korisničko ime je zauzeto.', 'Neuspešna registracija.');
            break;
          default:
            user.toastr.error(msg.description, 'Neuspešna registracija.');
            break;
        }
      }
    });
  }
} 