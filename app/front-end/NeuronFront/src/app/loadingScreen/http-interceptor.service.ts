import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
import { LoadingScreenServiceService } from './loading-screen-service.service';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor{

  constructor(public loadingScreenService: LoadingScreenServiceService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    //console.log("sss " + req.headers.keys())
    if (req.headers.has("skip")) {
      req = req.clone({
        headers: req.headers.delete("skip")
      });
      return next.handle(req);
    }

    this.loadingScreenService.isLoading=true;

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse)
      {
        //console.log(event.status);
        this.loadingScreenService.showNotification.next(true)
        this.loadingScreenService.isSuccess.next(true)
        this.loadingScreenService.startTimer()
      }
    }, error => 
    {
      //console.error("SS" + error.status);
      this.loadingScreenService.errorText = "Error code: " + error.status;
      this.loadingScreenService.showNotification.next(true)
      this.loadingScreenService.isSuccess.next(false)
      this.loadingScreenService.startTimer()

    }), 
    finalize(() => { this.loadingScreenService.isLoading=false;})
    )
  }
}
