import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StartTrainingService } from './service/start-training.service';

@Component({
  selector: 'app-start-training',
  templateUrl: './start-training.component.html',
  styleUrls: ['./start-training.component.css']
})
export class StartTrainingComponent implements OnInit {

  BatchSize : number = 32;
  NumOfEpochs : number = 50;
  EarlyStopping : number = 0;
  disabled : boolean = false;
  jsonObject : JSON | undefined;
  arrayObject : any = [];
  steps: number[] = [0, 1, 2, 4, 8, 16, 32, 64, 128];
  stepIndex:number=6;

  @Input() enabled : boolean = false;
  @Output() stopTraining : EventEmitter<boolean> = new EventEmitter();
  @Output() lastEpoch : EventEmitter<number> = new EventEmitter();
  @Output() startTraining : EventEmitter<string> = new EventEmitter();
  
  constructor(private startTrainingService : StartTrainingService) { }

  ngOnInit(): void {
  }
  formatLabel(value: number) {
    return Math.pow(2,value-1);
  }
  // formatLabelBatch(value: number){
  //   return this.steps[value];
  // }
  onBatchSizeValueChange($event : any){
    this.stepIndex = +$event.value;
    this.BatchSize = this.steps[this.stepIndex];
  }
  nearestPowerOf2(n : number) {
    if(n==0){
      return 0;
    }
    if(n>80){
      return 128;
    }
    return 1 << 31 - Math.clz32(n);
  }
  toggleEarlyStopping(){
    // this.EarlyStopping = !this.EarlyStopping;
  }
  onPlayClick() {
    this.arrayObject = {
      "BatchSize" : this.BatchSize,
      "NumOfEpochs" : this.NumOfEpochs,
      "EarlyStopping" : this.EarlyStopping
    };
    this.jsonObject = <JSON>this.arrayObject;
    this.disabled = true; 
    console.log(this.jsonObject);
    this.startTrainingService.sendTrainingParameters(this.jsonObject);
    this.startTraining.emit(this.BatchSize.toString());
    this.lastEpoch.emit(this.NumOfEpochs);
  }
  onStopTrainingClick(){
    this.disabled = false;
    this.stopTraining.emit(true);
  }
}
