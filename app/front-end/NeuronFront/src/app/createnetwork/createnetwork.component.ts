import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-createnetwork',
  templateUrl: './createnetwork.component.html',
  styleUrls: ['./createnetwork.component.css']
})
export class CreatenetworkComponent implements OnInit {

  trainSelectIndex : number = -1;
  showSideBar:boolean = true;
  @Input() modelList : string[] = ['Neimenovani Model'];
  @Input() selectedIndex : number = 0;
  @Input() numberOfModels : number = 1;
  changingValue: number = -1;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { 
    const inputcolnum = this.activatedRoute.snapshot.params['inputcolnum'];
    const outputcolnum = this.activatedRoute.snapshot.params['outputcolnum'];
    if(sessionStorage.getItem('currentModels')!=undefined){
      this.modelList = sessionStorage.getItem('currentModels')?.split(',') || ['Neimenovani Model'];
      this.numberOfModels = this.modelList.length;
    }else{
      sessionStorage.setItem('currentModels',this.modelList.toString());
    }
  }

  ngOnInit(): void {
    if(!localStorage.getItem('username')){
      this.showSideBar = false;
    }
  }

  deletedModel(e:string[]){
    this.numberOfModels-=1;
    if(this.selectedIndex){
      this.selectedIndex-=1;
    }
    window.location.reload();
  }
  newModelCreated(e : string[]){
      this.numberOfModels += 1;
      this.selectedIndex = this.numberOfModels - 1;
      sessionStorage.setItem('currentModels',this.modelList.toString());
  }
  updateModelNames(e : string[]){
    this.modelList = e;
    sessionStorage.setItem('currentModels',this.modelList.toString());
  }
  clickedNext(){
    this.selectedIndex += 1;
    console.log(this.selectedIndex);
  }
  clickedPrevious(){
    this.selectedIndex -= 1;
    console.log(this.selectedIndex);
  }
  startTraining(e:boolean){
    this.changingValue = this.selectedIndex;
  }
  changedModelFromModelOverview(i : number){
    this.selectedIndex=i;
  }
}
