import { Component, Input, OnInit } from '@angular/core';
import { EvaluationModel } from 'app/prediction-component/service/prediction.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-evaluation-thingy',
  templateUrl: './evaluation-thingy.component.html',
  styleUrls: ['./evaluation-thingy.component.css']
})
export class EvaluationThingyComponent implements OnInit {

  loss : string = '';
  mae : string = '';
  mse : string = '';
  rmse : string = '';
  auc : string = '';
  accuracy : string = '';
  text : string = 'Fukcija gubitka';
  displayedColumns : string[] = ['actual','predicted'];
  @Input() metrics : string[] = [];
  @Input() myIndex : number = 0;
  @Input() evaluateResponse: EvaluationModel = <EvaluationModel>{};
  @Input() test: number=0;
  // @Input() 
  //   set evaluateResponse(value: EvaluationModel){
  //     this._evaluateResponse = value;
  //     for(var i=1; i<value.Actual.length;i++){
  //       this.dataSource.push(<TableData>{actual:value.Actual[i],predicted:value.Predicted[i]});
  //     }
  //     console.log(this.dataSource);
  //   }; 
  //   get evaluationResponse(): EvaluationModel{
  //     return this._evaluateResponse;
  //   }

  dataSource : TableData[] = [];
  public get dataLength() : number{

    console.log(this.dataSource.length);
    return this.dataSource.length;
  }
  constructor() { }

  ngOnInit(): void {
    if(sessionStorage.getItem('trainingOnModel'+this.myIndex)!=undefined){
      var fromSession = JSON.parse(sessionStorage.getItem('model'+this.myIndex) || '');
      this.metrics = fromSession['Metrics'];
    }
    this.loss = this.evaluateResponse.Evaluation[0].toString();
    if(this.evaluateResponse.Evaluation[1]!=undefined){
      switch(this.metrics[0]){
        case 'mae':
          this.mae = this.evaluateResponse.Evaluation[1].toString();
          break;
        case 'mse':
          this.mse = this.evaluateResponse.Evaluation[1].toString();
          break;
        case 'rmse':
          this.rmse = this.evaluateResponse.Evaluation[1].toString();
          break;
        case 'accuracy':
          this.accuracy = this.evaluateResponse.Evaluation[1].toString();
          break;
        case 'auc':
          this.auc = this.evaluateResponse.Evaluation[1].toString();
          break;
        default:
          break;
      }
    }
    if(this.evaluateResponse.Evaluation[2]!=undefined){
      switch(this.metrics[1]){
        case 'mae':
          this.mae = this.evaluateResponse.Evaluation[2].toString();
          break;
        case 'mse':
          this.mse = this.evaluateResponse.Evaluation[2].toString();
          break;
        case 'rmse':
          this.rmse = this.evaluateResponse.Evaluation[2].toString();
          break;
        case 'accuracy':
          this.accuracy = this.evaluateResponse.Evaluation[2].toString();
          break;
        case 'auc':
          this.auc = this.evaluateResponse.Evaluation[2].toString();
          break;
        default:
          break;
      }
    }
    if(this.evaluateResponse.Evaluation[3]!=undefined){
      switch(this.metrics[2]){
        case 'mae':
          this.mae = this.evaluateResponse.Evaluation[3].toString();
          break;
        case 'mse':
          this.mse = this.evaluateResponse.Evaluation[3].toString();
          break;
        case 'rmse':
          this.rmse = this.evaluateResponse.Evaluation[3].toString();
          break;
        case 'accuracy':
          this.accuracy = this.evaluateResponse.Evaluation[3].toString();
          break;
        case 'auc':
          this.auc = this.evaluateResponse.Evaluation[3].toString();
          break;
        default:
          break;
      }
    }
    console.log('final destination ',this.metrics);
  }

}

export interface TableData{
  actual : number;
  predicted : number;
}