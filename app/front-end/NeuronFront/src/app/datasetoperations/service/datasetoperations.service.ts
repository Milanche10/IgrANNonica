import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'app/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class DatasetoperationsService {
  private baseUrl:String = ConstantsService.baseURL + "ML/"; 
  public data : any = [];
  public saveJSONForLaterUse : JSON | undefined;
  constructor(private http : HttpClient) { }

  sendTrainTestParameters(obj : JSON){
    console.log(obj);
    sessionStorage.setItem('trainTestJSON', JSON.stringify(obj));
    this.http.post<JSON>(this.baseUrl + 'splitTrainTest', obj).subscribe(result => {
      console.log(result);
      this.saveJSONForLaterUse = obj;
    }, error => {
      console.error(error)
     
    });
    
  }
  sendDataForScaling(obj : JSON){
    this.http.post<JSON>(this.baseUrl + 'scaleData', obj).subscribe(result => {
      console.log(result);
    }, error => console.error(error));
    console.log(obj);
  }
  funkcija(niz:any){
    this.data = niz;
    sessionStorage.setItem('Inputs',niz['Inputs'].toString());
    sessionStorage.setItem('Outputs',niz['Outputs'].toString());
  }
}