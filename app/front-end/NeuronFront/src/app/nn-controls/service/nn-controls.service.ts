import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'app/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class NnControlsService {
  private baseUrl:String = ConstantsService.baseURL+"ML/"; 
  constructor(private http : HttpClient) { }

  sendNeuronNetworkParameters(obj : JSON){
    this.http.post<JSON>(this.baseUrl + 'createModel', obj).subscribe(result => {
      console.log(result);
    }, error => console.error(error));
    console.log(obj);
  }
}
