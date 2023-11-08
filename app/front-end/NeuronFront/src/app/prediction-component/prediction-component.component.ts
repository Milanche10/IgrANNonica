import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingScreenServiceService } from 'app/loadingScreen/loading-screen-service.service';
import { EvaluationModel, PredictionService } from './service/prediction.service';

@Component({
  selector: 'app-prediction-component',
  templateUrl: './prediction-component.component.html',
  styleUrls: ['./prediction-component.component.css']
})
export class PredictionComponentComponent implements OnInit {

  @Input() configuration : string[] = [];
  @Input() myIndex : number = 0;
  @Input() metrics : string[] = [];
  json : any;
  arrayObject : any = [];
  disabled = false;
  evaluateResponse : EvaluationModel = <EvaluationModel>{};
  @Output() returnToConfigurationSettings : EventEmitter<boolean> = new EventEmitter();
  @Output() evaluateModel : EventEmitter<EvaluationModel> = new EventEmitter<EvaluationModel>();
  @Output() test : EventEmitter<number> = new EventEmitter<number>();
  
  constructor(public LoadingScreenService: LoadingScreenServiceService, public predicionService : PredictionService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('trainingOnModel'+this.myIndex)!=undefined){
      var HiddenLayerActivationFunc;
      var OutputLayerActivationFunc;
      var LossFunction;
      var fromSession = JSON.parse(sessionStorage.getItem('model'+this.myIndex) || '');
      HiddenLayerActivationFunc = fromSession['HiddenLayerActivationFunc'];
      OutputLayerActivationFunc=fromSession['OutputLayerActivationFunc'];
      switch(fromSession['LossFunction']){
        case 'binary_crossentropy':
          LossFunction = 'binary crossentropy';
          break;
        case 'mean_absolute_error':
          LossFunction = 'mean absolute error';
          break;
        case 'mean_squared_error':
          LossFunction = 'mean squared error';
          break;
        case 'categorical_crossentropy':
          LossFunction = 'categorical crossentropy';
          break;
      }
      this.metrics = fromSession['Metrics'];
      var config = [HiddenLayerActivationFunc,OutputLayerActivationFunc, LossFunction];
      this.configuration = config;
    }
  }

  onEvaluateModelClick(){
    var problem = sessionStorage.getItem('modelProblemType'+this.myIndex) || '';
    switch(problem){
      case 'regression':
        problem = 'Regression';
        break;
      case 'classification':
        problem = 'Class';
        break;
      default:
        break;
    }
    var BatchSize = Number(sessionStorage.getItem('trainingOnModel'+this.myIndex));
    this.arrayObject = {
      "Type": problem, 
      "BatchSize": BatchSize
    };
    this.json = <JSON>this.arrayObject;
    this.predicionService.sendEvaluationParameters(this.json);
    setTimeout(()=>{ 
      this.evaluateResponse = this.predicionService.evaluateresponse;
      this.evaluateModel.emit(this.evaluateResponse);
      console.log('where journey starts ',this.evaluateResponse);
      this.test.emit(6);
      this.disabled = true; 
    }, 400);
    
  }

  onChangeConfig(){
    this.disabled = false;
    this.returnToConfigurationSettings.emit(true);
    sessionStorage.removeItem('trainingOnModel'+this.myIndex);
    sessionStorage.removeItem('graphData'+this.myIndex);
  }

}
