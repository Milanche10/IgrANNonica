import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'app/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private baseUrl:String = ConstantsService.baseURL+"ML/"; 
  public evaluateresponse : EvaluationModel = <EvaluationModel>{};
  constructor(private http : HttpClient) { }

  sendEvaluationParameters(obj : JSON){
    this.http.post<string>(this.baseUrl + 'evaluateModel', obj).subscribe((result : string) => {
      console.log(result);
      this.evaluateresponse = JSON.parse(result);
      console.log(this.evaluateresponse.Actual);
    }, error => console.error(error));
    console.log(obj);
  }
}

export interface EvaluationModel{
  Evaluation : number[];
  Actual : number[];
  Predicted : number[];
}