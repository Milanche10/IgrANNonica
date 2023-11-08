import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoadingScreenServiceService } from 'app/loadingScreen/loading-screen-service.service';
import { Observable, Subscription } from 'rxjs';
import { NnControlsService } from './service/nn-controls.service';

@Component({
  selector: 'app-nn-controls',
  templateUrl: './nn-controls.component.html',
  styleUrls: ['./nn-controls.component.css']
})
export class NnControlsComponent implements OnInit {
  HiddenLayers : any = [1,1];
  HiddenLayerActivationFunc : string = '';
  OutputLayerActivationFunc : string = '';
  LossFunction : string = '';
  Metrics : any = [];
  jsonObject : JSON | undefined;
  arrayObject : any = [];
  _problemType: string = '';
  setOptions : number = 0;

  private eventsSubscription: Subscription = new Subscription();
  @Input() events: Observable<number[]> = new Observable<number[]>();
  @Input() disabled : boolean = false;
  @Input() firstLayer: number = 1;
  @Input() myIndex: number = 0;
  @Input() OutputUnits : number = 1;
  @Input() recalibrate : boolean = false;
  @Input()
  set problemType(value: string) {
    this._problemType = value;
    console.log(value);
    switch(value){
      case 'regression':
        this.OutputLayerActivationFunc='linear';
        this.HiddenLayerActivationFunc='relu';
        this.LossFunction = 'binary crossentropy';
        this.setOptions = 1;
        this.HiddenLayers[0] = sessionStorage.getItem('Inputs')?.split(',').length || 1;
        break;
      case 'classification':
        this.OutputLayerActivationFunc='sigmoid';
        this.HiddenLayerActivationFunc='relu';
        this.LossFunction = 'binary crossentropy';
        this.setOptions = 2;
        this.HiddenLayers[0] = sessionStorage.getItem('Inputs')?.split(',').length || 1;
        break;
      default:
        this.HiddenLayerActivationFunc='relu';
        this.LossFunction = 'binary crossentropy';
        break;
    }
    // if(sessionStorage.getItem('model'+this.myIndex)){
    //   this.takeFromSession();
    // }
  }
  get problemType() {
    return this._problemType;
  }
  
  @Output() numberOfHiddenLayersFromControls : EventEmitter<number> = new EventEmitter();
  @Output() arrayOfHiddenLayersFromControls : EventEmitter<number[]> = new EventEmitter();
  @Output() disableButtonsOnNeuronLayers : EventEmitter<string[]> = new EventEmitter();
  @Output() enableButtonsOnNeuronLayers : EventEmitter<boolean> = new EventEmitter();

  constructor(private nnControlsService : NnControlsService, public LoadingScreenService: LoadingScreenServiceService) { }

  ngOnInit(): void {
    this.eventsSubscription = this.events.subscribe((data) => this.changeNumberOfNeuronsInLayerById(data[0],data[1]));
    this.problemType = sessionStorage.getItem('modelProblemType'+this.myIndex) || '';
    this.takeFromSession();
  }

  ngAfterViewInit(){
    this.takeFromSession();
  }

  takeFromSession(){
    if(sessionStorage.getItem('model'+this.myIndex)!=undefined){
      var fromSession = JSON.parse(sessionStorage.getItem('model'+this.myIndex) || '');
      this.HiddenLayerActivationFunc = fromSession['HiddenLayerActivationFunc'];
      this.HiddenLayers = fromSession['HiddenLayers'];
      this.numberOfHiddenLayersFromControls.emit(this.HiddenLayers.length);
      this.arrayOfHiddenLayersFromControls.emit(this.HiddenLayers);
      this.OutputUnits = fromSession['OutputUnits'];
      this.OutputLayerActivationFunc=fromSession['OutputLayerActivationFunc'];
      switch(fromSession['LossFunction']){
        case 'binary_crossentropy':
          this.LossFunction = 'binary crossentropy';
          break;
        case 'mean_absolute_error':
          this.LossFunction = 'mean absolute error';
          break;
        case 'mean_squared_error':
          this.LossFunction = 'mean squared error';
          break;
        case 'categorical_crossentropy':
          this.LossFunction = 'categorical crossentropy';
          break;
      }
      this.Metrics = fromSession['Metrics'];
    }else{
      sessionStorage.setItem('model'+this.myIndex, JSON.stringify(this.createJson()));  
    }
  }

  onPlusClick(){
    this.HiddenLayers[0] =this.firstLayer;
    this.HiddenLayers.push(1);
    this.numberOfHiddenLayersFromControls.emit(this.HiddenLayers.length);
    this.arrayOfHiddenLayersFromControls.emit(this.HiddenLayers);
    sessionStorage.setItem('model'+this.myIndex, JSON.stringify(this.createJson()));  
  }
  onMinusClick(){
    this.HiddenLayers.pop();
    this.numberOfHiddenLayersFromControls.emit(this.HiddenLayers.length);
    this.arrayOfHiddenLayersFromControls.emit(this.HiddenLayers);
    sessionStorage.setItem('model'+this.myIndex, JSON.stringify(this.createJson()));  
  }

  createJson(){
    var loss;
    switch(this.LossFunction){
      case 'binary crossentropy':
        loss=this.LossFunction.replace(' ','_');
        break;
      case 'mean absolute error':
        loss=this.LossFunction.replace(' ','_');
        loss=loss.replace(' ','_');
        break;
      case 'mean squared error':
        loss=this.LossFunction.replace(' ','_');
        loss=loss.replace(' ','_');
        break;
      case 'categorical crossentropy':
        loss=this.LossFunction.replace(' ','_');
        break;
    }
    this.arrayObject = {
      "HiddenLayers" : this.HiddenLayers,
      "HiddenLayerActivationFunc" : this.HiddenLayerActivationFunc,
      "OutputUnits" : this.OutputUnits,
      "OutputLayerActivationFunc" : this.OutputLayerActivationFunc,
      "LossFunction" : loss,
      "Metrics" : this.Metrics
    };
    this.jsonObject = <JSON>this.arrayObject;
    return this.jsonObject;
  }

  onPlayClick(){
    this.disabled = true;
    var newjson = this.createJson();
    this.nnControlsService.sendNeuronNetworkParameters(newjson);
    console.log(this.jsonObject);
    var config = [this.HiddenLayerActivationFunc,this.OutputLayerActivationFunc, this.LossFunction];
    this.Metrics.forEach( (x:string) =>{
      config.push(x);
    });
    console.log("config ", config);
    this.disableButtonsOnNeuronLayers.emit(config);
  }

  changeNumberOfNeuronsInLayerById(i:number, value: number){
    this.HiddenLayers[i] += value;
    this.arrayOfHiddenLayersFromControls.emit(this.HiddenLayers);
    console.log(this.HiddenLayers);
    sessionStorage.setItem('model'+this.myIndex, JSON.stringify(this.createJson()));  
  }

  receivedSingleSelectEvent(jsonElement : string, selectedOption: string){
    switch (jsonElement){
      case "HLAF":
        this.HiddenLayerActivationFunc = selectedOption;
        break;
      case "OLAF":
        this.OutputLayerActivationFunc = selectedOption;
        break;
      case "LF":
        this.LossFunction = selectedOption;
        break;
      default:
        break;
    }   
    sessionStorage.setItem('model'+this.myIndex, JSON.stringify(this.createJson()));  
  }
  receivedMultiSelectEvent(selectedOptions: string[]){
    this.Metrics = selectedOptions;
    sessionStorage.setItem('model'+this.myIndex, JSON.stringify(this.createJson()));  
  }

  reEnableButtons(){
    this.disabled = false;
    this.enableButtonsOnNeuronLayers.emit(true);
  }

}
