import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { DatePipe, NgIfContext } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Experiment, ExperimentsService } from 'app/experiments/service/experiments.service';
import { Model } from 'app/experiments/service/experiments.service';
import { ConstantsService } from 'app/constants/constants.service';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';
@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent implements OnInit {
  public experiments: Experiment[] | undefined; 
  public enableEdit = false;
  public enableEditIndex = null;
  public modelName = ''; 
  private modelID = 0;
  private experimentID = 0;
  public page = 1; 
  public pageSize = 3; 
  constructor(private http: HttpClient, public datePipe: DatePipe, config: NgbModalConfig, private modalService: NgbModal, public service:ExperimentsService, private fileupload:FileuploadService) { 
    const response = this.service.getExperiments().subscribe(result => {
      service.loadModels(this.service.selectedExperiment.id); 
    }, 
    error => console.error(error));
    console.log("ID: ", service.selectedExperiment); 
  }
  
  ngOnInit(): void {
  }
  
  open(content : TemplateRef<any>, model:Model) {
    this.modalService.open(content,{size:'xl', scrollable: true});
    console.log("Model ID: ", model.Id); 
    this.modelName = model.modelName; 
    this.modelID = model.Id; 
    this.experimentID = model.experimentid;
  }
  public deleteModel(content: TemplateRef<any>){
    console.log("Eksperiment ID:",Number(this.experimentID));
    this.service.loadModels(this.experimentID);
    const response = this.service.deleteModel(this.modelID).subscribe(result => {
      console.log(result);
      this.service.loadModels(this.experimentID);
    },
    error => console.error(error));
    this.modalService.dismissAll();
  }
  public enableEditMethod(index:any) {
    this.enableEdit = true;
    this.enableEditIndex = index;
    console.log(index);
  }
  public showEdit(index:any){
    if((index == this.enableEditIndex) && this.enableEdit)
      return true;
    return false;  
  }
  saveEdit(model:Model){
    this.service.updateModel(model); 
    this.enableEdit = false; 
  }
  public setModel(model: Model){
    this.service.setModel(model); 
  }

  openModel(model: Model){
    console.log("Model: ", model); 
    sessionStorage.clear(); 
    const response = this.service.openExperiment(model.experimentid).subscribe((result:any)=> {
      console.log("Experiment obj: ", result); 
      sessionStorage.setItem('Inputs', result.Inputs); 
      sessionStorage.setItem('Outputs', result.Outputs); 
      sessionStorage.setItem('currentModels', result.currentModels); 
      sessionStorage.setItem('experimentName', result.experimentName); 
      sessionStorage.setItem('experimentID', result.id);
      this.modelID = result.modelIDInExperiment;
      let body = {Id : model.experimentid};
      console.log("Body : ",body); 
      this.http.post(ConstantsService.baseURL+'Experiment/loadExperiment', body).subscribe((result:any)=>{
        console.log("Successfull"); 
        this.getModel(model.Id); 
      }, err => console.log(err));  
    }); 
  }
  getModel(id: Number){ 
    var path = ConstantsService.baseURL+'Model/getModelById' ; 
    var modelProblemType = 'modelProblemType'; 
    var model = 'model'; 
    var body = {
      modelId : Number(id)
    }
    this.http.post(ConstantsService.baseURL+'ML/loadModel',body).subscribe((result:any)=>{}, err => console.log(err));
    var response = this.http.get(path+"?id="+id).subscribe((result:any) =>{
      console.log(result);
      sessionStorage.setItem(model+result.modelIDInExperiment, result.configuration);
      sessionStorage.setItem(modelProblemType + result.modelIDInExperiment, result.modelProblemType); 
      sessionStorage.setItem('trainingOnModel', result.trainingOnModel); 
      sessionStorage.setItem('trainTestJSON', result.trainTestJSON); 
      window.location.replace('neuronnetwork/2/3'); 
    }, err=>console.log(err));
  }
}