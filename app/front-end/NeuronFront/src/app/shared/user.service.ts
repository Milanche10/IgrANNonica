import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConstantsService } from 'app/constants/constants.service';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb:FormBuilder, private router:Router,  private http:HttpClient, private fileUploadS:FileuploadService) { }
  formModel = this.fb.group({
    UserName: ['', [Validators.required, Validators.pattern("^[A-Za-z0-9_-]{4,16}$")]], 
    Email: ['', [Validators.email, Validators.required, Validators.pattern("^[a-zA-Z0-9\\u0400-\\u04FF_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")]],
    FullName: ['', [Validators.required, Validators.pattern("^[^0-9]+$")]], 
    Passwords:this.fb.group({
      Password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,24}$")]],
      ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, {validator: this.comparePasswords})
  }); 
  loginForm = new FormGroup(
    {
      UserName: new FormControl("", [Validators.required]), 
      Password: new FormControl("", [Validators.required])
    }
  ); 

  comparePasswords(fb:FormGroup){
    let confirm = fb.get('ConfirmPassword'); 
    if((confirm?.errors == null) || ('passwordMismatch' in confirm.errors)){
      if(fb.get('Password')?.value != confirm?.value)
        confirm?.setErrors({passwordMismatch:true}); 
      else 
        confirm?.setErrors(null); 
    }
  }

  register(){
    var body = {
      UserName : this.formModel.value.UserName,
      Email : this.formModel.value.Email,
      FullName : this.formModel.value.FullName,
      Password : this.formModel.value.Passwords.Password
    }; 
    return this.http.post(ConstantsService.baseURL + "ApplicationUser/Register", body); 
  }
  autoLogin(username:string, password:string){
    var body = {
      UserName : username, 
      Password : password
    }
    console.log(username, "   ", password); 
    return this.http.post(ConstantsService.baseURL + "ApplicationUser/Login", body); 
  }
  login(){
    var body = {
      UserName : this.loginForm.value.UserName, 
      Password : this.loginForm.value.Password
    }; 
    return this.http.post(ConstantsService.baseURL + "ApplicationUser/Login", body); 
  }
  setStorage(token:any){
    localStorage.clear(); 
    localStorage.setItem('token', token); 
    localStorage.setItem('username', this.getLoggedUser()); 
    this.router.navigate(["/"]); 
  }
  // Jos ne vodi ni na jedan request
  //Mora da se podese putanje
  createSesion(){
    return this.http.post(ConstantsService.baseURL + "ApplicationUser/createSession", { headers: { skip: "true" }});
  }
  isUserAuthenticated(){
    const token = localStorage.getItem("token"); 
    if(token && localStorage.getItem("guest") == null)
      return true; 
    return false; 
  }

  logOut(){
    var user = this;
    this.http.post(ConstantsService.baseURL + 'ApplicationUser/logout', {
      headers: {
        "Authorization": localStorage.getItem('token')
      }
    }).subscribe(result => {
      console.log(result);
    }, error => console.error(error));
    sessionStorage.clear();
    localStorage.clear();       // Comment this line and uncomment rest if there is a problem with localStorage
    //localStorage.removeItem('token'); 
    //localStorage.removeItem('refreshToken')
    //localStorage.removeItem('username'); 
    this.createSesion().subscribe(response => {
      let token = (<any>response).Token;
      let username = (<any>response).Username;
      localStorage.setItem("token", token);
      localStorage.setItem("guest", "true")
    });
    this.fileUploadS.pocetak();
    this.fileUploadS.updatedArray=[];
    this.router.navigate(['/']); 
   
  }

  getLoggedUser(){
    return this.loginForm.value.UserName;
  }
}