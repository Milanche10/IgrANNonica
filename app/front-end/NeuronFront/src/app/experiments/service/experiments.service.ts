import { Injectable } from '@angular/core';
import { ConstantsService } from 'app/constants/constants.service';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ExperimentsService {
  private baseModel : string = ConstantsService.baseURL + "Model/getModels"; 
  public experiments: Experiment[] | undefined;
  public models: Model[] | undefined; 
  private experimentID = 0; 
  public selectedExperiment:any; 
  public selectedModel: any; 
  constructor(private http: HttpClient, private router: Router){
  }
  public lengthOfModels(){
    if(this.models)
      return this.models.length;
    return 0; 
  }
  getModels(experimentID: number){
    var body = { id: experimentID}
    console.log("experiment.service.getModels => Hocu modele za experiment ID: ", experimentID); 
    return this.http.post(this.baseModel,body);
  }
  loadModels(value:number){
    const response = this.getModels(value).subscribe(result => {
        this.models = result as Model[];
    },
    error => console.error(error));
  }
  getExperiments(){
    return this.http.get(ConstantsService.baseURL + 'Experiment/GetUserExperiments');
  }
  openExperiment(experimentID:Number){
    var body = { id: experimentID}; 
    return this.http.post(ConstantsService.baseURL + 'Experiment/GetExperiment', body); 
  }
  deleteExperiment(experimentID: number){
    console.log("Brisem ID: ", experimentID); 
    let httpParams = new HttpParams().set('id', experimentID);
    let options = { params: httpParams };
    return this.http.delete(ConstantsService.baseURL+'Experiment/deleteExperiment',options); 
  }
  updateExperiment(exp: Experiment){
    var body = {
      id: exp.id,
      experimentName: exp.experimentName
    }; 
    var id; 
    var path = ConstantsService.baseURL+'Experiment/'+exp.id; 
    return this.http.put(path,body).subscribe( data => id = exp.id); 
  }
  deleteModel(modelID: number){
    console.log("Brisem ID: ", modelID); 
    let httpParams = new HttpParams().set('id', modelID);
    let options = { params: httpParams };
    return this.http.delete(ConstantsService.baseURL+'Model/deleteModel',options); 
  }

  updateModel(model:Model){
    var body = {
      id: model.Id,
      modelName: model.modelName
    }; 

    var path = ConstantsService.baseURL+'Model/updateModel' ; 
    return this.http.put(path, body, {params: body}).subscribe(); 
  }

  openModel(id: Number){
    var body = { id: id }; 
    var path = ConstantsService.baseURL+'Model/getModelById' ; 
    return this.http.post(path, body).subscribe(); 
  }
  loadExperiment(exp: Number){
    const response = this.openExperiment(exp).subscribe((result:any)=> {
      console.log(result); 
      sessionStorage.clear(); 
      sessionStorage.setItem('Inputs', result.Inputs); 
      sessionStorage.setItem('experimentName', result.experimentName); 
      sessionStorage.setItem('Outputs', result.Outputs); 
      sessionStorage.setItem('currentModels', result.currentModels); 
      sessionStorage.setItem('experimentID', result.id);
      this.router.navigate(['./neuronnetwork',2,3]).then(
        ()=>{}
      );
    }); 
  }
  public getLink(exp:Experiment){
    if(this.selectedExperiment?.id==exp.id)
      return true; 
    return false;   
  }
  public getLinkModel(model:Model){
    if(this.selectedModel?.id==model.Id)
      return true; 
    return false;   
  }
  public setExperiment(exp:Experiment){
    this.selectedExperiment = exp;
    this.loadModels(exp.id); 
  }

  public setModel(model:Model){
    this.selectedModel = model;

  }
}
export interface Experiment{
  id : number; 
  user: number; 
  experimentName: string; 
  createDate : Date; 
  statisticsPath : String; 
  currentModels: String; 
  inputs: String; 
  outputs: String;

}
export interface Model{
  Id: number; 
  modelName: string; 
  experimentid: number; 
  createDate: Date; 
  lastModificationDate: Date; 
  modelIDInExperiment: String;
  modelProblemType: String;
  configuration: String; 
  trainingOnModel:String

}