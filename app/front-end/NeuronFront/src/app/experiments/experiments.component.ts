import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExperimentsService } from './service/experiments.service';
import { Experiment } from './service/experiments.service';
import { ProfileComponent } from 'app/profile/profile.component';
import { ModelsComponent } from 'app/models/models.component';
@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.css'], 
  providers: [NgbModalConfig, NgbModal]
})
export class ExperimentsComponent implements OnInit {
  public experiments: Experiment[] | undefined;
  public enableEdit = false;
  private experimentID = 0;
  public enableEditIndex = null;
  public experimentName = ''; 
  public page = 1; 
  public pageSize = 3; 

  constructor(http: HttpClient, public datePipe: DatePipe, config: NgbModalConfig, private modalService: NgbModal, public service:ExperimentsService, public profile:ProfileComponent) {
    this.loadExperiments(); 
  }
  ngOnInit(): void {
  }
  loadExperiments(){
    const response = this.service.getExperiments().subscribe(result => {
      this.experiments = result as Experiment[];
      this.service.selectedExperiment = this.experiments[0]; 
      this.service.getModels(this.service.selectedExperiment.id); 
      this.service.getLink(this.service.selectedExperiment); 
      this.profile.experimentName = this.service.selectedExperiment.experimentName; 
    }, 
    error => console.error(error));
  }
  open(content : TemplateRef<any>, experiment:Experiment) {
    this.modalService.open(content,{size:'xl', scrollable: true});
    console.log("Experiment ID: ", experiment.id); 
    this.experimentName = experiment.experimentName; 
    this.experimentID = experiment.id; 
  }
  /*openExperiment(content : TemplateRef<any>, experiment:Experiment) {
    this.getModels(experiment.id);
    const modal = this.modalService.open(content,{centered:true, size:'xl', scrollable: true});
    this.experimentName = experiment.experimentName; 
  }*/
  openExperiment(experiment:Experiment) {
    console.log("Experiment open");
    this.service.loadExperiment(experiment.id); 
  }
  public lengthOfExperiments(){
    if(this.experiments)
      return this.experiments.length;
    return 0; 
  }
  public deleteExperiment(){
    console.log(" Service : Brisem eksperiment ID:",this.experimentID);
    const response = this.service.deleteExperiment(this.experimentID).subscribe(result => {
      console.log(result); 
      this.loadExperiments(); 
      if(this.experiments){
        this.service.setExperiment(this.experiments[0]); 
        this.service.loadModels(this.service.selectedExperiment.id); 
      }
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
  saveEdit(exp:Experiment){
    this.service.updateExperiment(exp); 
    this.enableEdit = false; 
  }
  public setExperiment(exp: Experiment){
    this.service.setExperiment(exp); 
    this.profile.experimentName = this.service.selectedExperiment.experimentName; 
  }
}