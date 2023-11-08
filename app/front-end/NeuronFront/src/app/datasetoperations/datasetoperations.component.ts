import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, ViewChild } from '@angular/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatasetoperationsService } from './service/datasetoperations.service';


@Component({
  selector: 'app-datasetoperations',
  templateUrl: './datasetoperations.component.html',
  styleUrls: ['./datasetoperations.component.css']
})
export class DatasetoperationsComponent implements OnInit {
  testValue: number = 10;
  trainValue: number = 75;
  validationValue: number = 15;
  unused: number=0;
  randomized:boolean = false;
  jsonObject: JSON | undefined;
  arrayObject: any = [];
  options: string[] = ['regression', 'classification'];
  previouslySelectedOption: string = this.options[0];
  selectedOption : string = this.previouslySelectedOption;
  // @Output() onSelectedEventSingle : EventEmitter<string> = new EventEmitter();

  fromPage : string = '';
  constructor(private datasetoperationsService: DatasetoperationsService, public dialog: MatDialog, public dialogRef: MatDialogRef<DatasetoperationsComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data;
  }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    return Math.round(value) + '%';
  }
  onTrainValueChange(e: any, valueFromInput : boolean) {
    if(valueFromInput){
      this.unused = 100 - this.testValue - this.validationValue - this.trainValue;
    }else{
    if (this.testValue + this.trainValue + this.validationValue >= 100) {
      setTimeout(() => {
        this.trainValue = 100 - this.testValue - this.validationValue;
      }, 0);
      this.unused = 0;
    }else{
      this.unused = 100 - this.testValue - this.validationValue - this.trainValue;
    }
  }
  }
  onTestValueChange(e: any, valueFromInput : boolean) {
    if(valueFromInput){
      this.unused = 100 - this.testValue - this.validationValue - this.trainValue;
    }else{
    if (this.testValue + this.trainValue + this.validationValue >= 100) {
      setTimeout(() => {
        this.testValue = 100 - this.trainValue - this.validationValue;
      }, 0);
      this.unused = 0;
    }else{
      this.unused = 100 - this.testValue - this.validationValue - this.trainValue;
    }}
  }
  onValidationValueChange(e: any, valueFromInput : boolean) {
    if(valueFromInput){
      this.unused = 100 - this.testValue - this.validationValue - this.trainValue;
    }else{
      if (this.testValue + this.trainValue + this.validationValue >= 100) {
      setTimeout(() => {
        this.validationValue = 100 - this.testValue - this.trainValue;
      }, 0);
      this.unused = 0;
    }else{
      this.unused = 100 - this.testValue - this.validationValue - this.trainValue;
    }
    }
    
  }
  selectedSingle(){
    // this.onSelectedEventSingle.emit(this.selectedOption);
    // this.fromPage+=this.selectedOption;
  }
  onProceed() {
    this.arrayObject = {
      "TestSize": this.testValue / 100,
      "TrainSize": this.trainValue / 100,
      "ValidationSize": this.validationValue / 100,
      "Shuffle" : this.randomized,
      "SplitSeed" : 50
    };
    this.jsonObject = <JSON>this.arrayObject;    
    this.datasetoperationsService.sendTrainTestParameters(this.jsonObject);
    var data = this.datasetoperationsService.data;
    data['Type']=this.selectedOption;
    console.log('ESP!!'+data);
    this.dialogRef.close({ event: 'close', data: data });
  }

  toggleRandomizedOption(){
    this.randomized = !this.randomized;
  }

}
