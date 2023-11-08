import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'app/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class StartTrainingService {
  private baseUrl:String = ConstantsService.baseURL + "ML/"; 
  constructor(private http : HttpClient) { }
  
  sendTrainingParameters(obj : JSON){
    this.http.post<JSON>(this.baseUrl + 'trainModel', obj).subscribe(result => {
      console.log(result);
    }, error => console.error(error));
    
  }
}
