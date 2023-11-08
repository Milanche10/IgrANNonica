import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingScreenServiceService } from 'app/loadingScreen/loading-screen-service.service';
import { ConstantsService } from 'app/constants/constants.service';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-global-experiment-controls',
  templateUrl: './global-experiment-controls.component.html',
  styleUrls: ['./global-experiment-controls.component.css']
})
export class GlobalExperimentControlsComponent implements OnInit {

  public modelId : number = 0;
  @Input() modelList : string[] = ['Neimenovani Model'];
  name : string = '';
  experimentName : string = '';
  placeholder : string = 'Galaksije po emitovanju radio talasa';
  
  @Input() isPreviousEnabled: boolean = true;
  @Input() isNextEnabled: boolean = true;
  @Output() nextEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() previousEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() changedModelEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() createNewModel : EventEmitter<string[]> = new EventEmitter();
  @Output() updatedModelName : EventEmitter<string[]> = new EventEmitter();
  @Output() deletedModel : EventEmitter<string[]> = new EventEmitter();
  constructor(private router:Router, public LoadingScreenService: LoadingScreenServiceService, private http:HttpClient) { }

  ngOnInit(): void {
    this.experimentName = sessionStorage.getItem('experimentName') || '';
    sessionStorage.setItem('currentModels',this.modelList.toString());
  }

  onExperimentNameChange(){
    sessionStorage.setItem('experimentName',this.experimentName);
  }

  onInputChange(){
    this.modelList[this.modelId] = this.name;
    this.updatedModelName.emit(this.modelList);
  }
  onCreateNewModelClick(){
    // this.modelList[this.modelId]='Neimenovani Model';
    this.modelList.push('Neimenovani Model');
    this.modelId = this.modelList.length-1;
    this.createNewModel.emit(this.modelList);
  }
  onCreateNewExperimentClick() {
    window.location.reload();
    localStorage.setItem('Inputs', sessionStorage.getItem('Inputs') || '');
    localStorage.setItem('Outputs', sessionStorage.getItem('Outputs') || '');
    sessionStorage.clear();
    sessionStorage.setItem('Inputs', localStorage.getItem('Inputs') || '');
    sessionStorage.setItem('Outputs', localStorage.getItem('Outputs') || '');
    localStorage.removeItem('Inputs');
    localStorage.removeItem('Outputs');
  }
  onAddNewDataToExistingExperimentClick(){
    this.router.navigate([`./fileupload`]).then(
      ()=>{}
    );
  }
  onPreviousClick(){
    this.modelId -=1;
    this.previousEvent.emit("Clicked previous");
  }
  onNextClick(){
    this.modelId+=1;
    this.nextEvent.emit("Clicked next");
  }
  changedModelOnClick(i: number){
    this.modelId = i;
    this.changedModelEvent.emit(i);
  }

  onDeleteClick(){
    for(let index = this.modelId; index<this.modelList.length-1;index++){
      sessionStorage.setItem('model'+index,sessionStorage.getItem('model'+(index+1))||'');
      sessionStorage.setItem('modelProblemType'+index,sessionStorage.getItem('modelProblemType'+(index+1))||'');
      if(sessionStorage.getItem('trainingOnModel'+(index+1))!=undefined){
        sessionStorage.setItem('trainingOnModel'+index,sessionStorage.getItem('trainingOnModel'+(index+1))||'');
        sessionStorage.setItem('graphData'+index,sessionStorage.getItem('graphData'+(index+1))||'');
      }else if(sessionStorage.getItem('trainingOnModel'+index)!=undefined && index==this.modelId){
        sessionStorage.removeItem('trainingOnModel'+index);
        sessionStorage.removeItem('graphData'+index);
      }
    }
    sessionStorage.removeItem('model'+(this.modelList.length-1));
    sessionStorage.removeItem('modelProblemType'+(this.modelList.length-1));
    this.modelList.splice(this.modelId,1);
    sessionStorage.setItem('currentModels',this.modelList.toString());
    this.modelId=0;
    this.deletedModel.emit(this.modelList);
  }
  SaveExperiment(){
    console.log("Cuvanje eksperimenta"); 
    var body = {
      experimentName: sessionStorage.getItem('experimentName'),  
      currentModels: sessionStorage.getItem('currentModels')
    };

    var path = ConstantsService.baseURL + 'Experiment/saveExperiment'; 
    console.log(path); 
    var response = this.http.post(path, body).subscribe( (result:any) => { sessionStorage.setItem('experimentID', result.id)});
  } 
  
  SaveModel(){
    console.log("Cuvanje modela"); 
    console.log("Model Id:", this.modelId); 
    console.log("Model Name:",this.modelList[this.modelId]); 
    var trainingOnModel:Number = 32; 
    if(sessionStorage.getItem('trainingOnModel'+this.modelId))
      trainingOnModel = Number(sessionStorage.getItem('trainingOnModel'+this.modelId)); 

    var body = {
      experimentid: sessionStorage.getItem('experimentID'), 
      modelName :this.modelList[this.modelId],
      modelIDInExperiment : this.modelId, 
      modelProblemType : sessionStorage.getItem('modelProblemType'+this.modelId), 
      configuration : sessionStorage.getItem('model'+ this.modelId),
      trainingOnModel : trainingOnModel,
      trainTestJSON: sessionStorage.getItem('trainTestJSON'),
      Filename: this.modelList[this.modelId]
    };
    console.log(body); 
    //var path = ConstantsService.baseURL + 'Model/saveModel'; 
    var path = ConstantsService.baseURL + 'ML/saveModel'; 
    console.log(path); 
    this.http.post(path, body).subscribe(); 
   /*var body = {

    }; 
    var path = ConstantsService.baseURL + 'Experiment/updateExperiment'; 
    console.log(path); 
    this.http.post(path, body).subscribe(); 
    body = {
      experimentName: sessionStorage.getItem('currentModels'),  
      currentModels: ''
    }; */
 ///   return this.http.post(path, body).subscribe(); 
  }
}
