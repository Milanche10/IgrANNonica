import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler){
    let token=localStorage.getItem('token');
    let tokenizedReq=req.clone(
      {
        
        setHeaders:{
          Authorization:`Bearer ${token}` 
        }
      }
    );
    return next.handle(tokenizedReq);
   
  }
}
