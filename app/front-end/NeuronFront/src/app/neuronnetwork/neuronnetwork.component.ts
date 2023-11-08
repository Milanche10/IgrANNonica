import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { EvaluationModel } from 'app/prediction-component/service/prediction.service';
import { Subject } from 'rxjs';
import { DatasetoperationsComponent } from '../datasetoperations/datasetoperations.component';

@Component({
  selector: 'app-neuronnetwork',
  animations: [
    trigger("rollUp", [
      state("true", style({ height: "650px" })),
      state("false", style({ height: "150px"})),
      transition("* => *", animate("300ms linear"))
    ]),
    trigger("rollUp", [
      state("false", style({ height: "150px"})),
      state("true", style({ height: "650px" })),
      transition("* => *", animate("300ms linear"))
    ]),
    trigger("slideUp", [
      state("true", style({ height: 0, display:'none' })),
      state("false", style({ height: "300px" })),
      transition("* => *", animate("300ms linear"))
    ]),
    trigger("slideUp", [
      state("false", style({ height: "300px" })),
      state("true", style({ height: 0, display:'none' })),
      transition("* => *", animate("300ms linear"))
    ])
  ],
  templateUrl: './neuronnetwork.component.html',
  styleUrls: ['./neuronnetwork.component.css']
})
export class NeuronnetworkComponent implements OnInit {

  rollUp : boolean = true;
  slideUp : boolean = true;

  disableButtons: boolean = false;
  configurationFromNNControls : string[] = [];
  enableEverything : boolean = true;
  outputUnits : number = 1;
  problemType: string = '';
  started : boolean = false;
  recalibrateMetrics : boolean = false ;
  lastEpoch : number = 0;
  metrics: string[] = [];
  BatchSize: number = 0;
  public test: number = 5;
  public evaluateResponse : EvaluationModel = <EvaluationModel>{};
  evaluate : boolean = false;
  customNeuronNumberAddedOnLayer : number[] = [];
  @Input() shownOnScreen : boolean = true;
  @Input() myIndex : number = 0;
  @Input() numberOfHiddenLayersCaughtFromControls : number = 2;
  @Input() arrayOfHiddenLayersCaughtFromControls : any = [];
  @Output() startTrainingEvent : EventEmitter<boolean> = new EventEmitter();

  public idOfLayerToAdd : number = 0;

  neuronAddedOnLayerId : Subject<number[]> = new Subject<number[]>();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('model'+this.myIndex)!=undefined){
      // this.configurationFromNNControls = sessionStorage.getItem('model'+this.myIndex)?.split(',') || [];
      if(sessionStorage.getItem('trainingOnModel'+this.myIndex)!=undefined){
        // this.configurationFromNNControls = sessionStorage.getItem('model'+this.myIndex)?.split(',') || [];
        this.startTrainingEvent.emit(true);
        this.rollUp=!this.rollUp;
        this.started=true;
        this.slideUp=!this.slideUp;
        this.disableButtons = !this.disableButtons;
        this.enableEverything = !this.enableEverything;
      }
    }else{
      // sessionStorage.setItem('model'+this.myIndex,this.configurationFromNNControls.toString());
      this.openDialog();
    }

    this.arrayOfHiddenLayersCaughtFromControls.push(sessionStorage.getItem('Inputs')?.split(',').length || 1);
    this.outputUnits = sessionStorage.getItem('Outputs')?.split(',').length || 1;
    
  }

  openDialog() {
    // this.dialog.open(DatasetoperationsComponent);
    this.recalibrateMetrics = !this.recalibrateMetrics;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.height = '70%';

    const dialogRef = this.dialog.open(DatasetoperationsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      console.log(result.data);
      console.log(this.arrayOfHiddenLayersCaughtFromControls);
      this.problemType = result.data['Type'];
      console.log(this.problemType, " from neuronnetwork");
      sessionStorage.setItem('modelProblemType'+this.myIndex, this.problemType);  
      this.recalibrateMetrics = !this.recalibrateMetrics;
    });
  }
  onLastEpochSendingEvent(e: number){
    this.lastEpoch = e;
  }
  onChangeNumberOfHiddenLayersEvent(n : number){
    this.numberOfHiddenLayersCaughtFromControls = n;
  }
  onChangeNumberOfNeuronsInLayer(obj : any[]){
    this.arrayOfHiddenLayersCaughtFromControls = obj; 
  }

  onAddedNeuronsEvent( i : number){
    this.neuronAddedOnLayerId.next([i, 1]);

  }
  onSubtractedNeuronsEvent( i : number){
    this.neuronAddedOnLayerId.next([i, -1]);
  }
  onDisableButtonsEvent(config : string[]){
    this.configurationFromNNControls = config;
    this.metrics = this.configurationFromNNControls.splice(3,8);
    this.disableButtons = !this.disableButtons;
    this.enableEverything = !this.enableEverything;
  }
  stopTraining(){
    this.disableButtons = !this.disableButtons;
    this.enableEverything = !this.enableEverything;
  }
  startTraining(BatchSize : string){
    this.startTrainingEvent.emit(true);
    this.started=true;
    this.rollUp = !this.rollUp;
    this.slideUp = !this.slideUp;
    this.BatchSize = Number(BatchSize);
    }
  returnToConfigurationSettings(){
    this.rollUp = !this.rollUp;
    this.slideUp = !this.slideUp;
    this.started=false;
    this.evaluate = false;
  }
  openDialogBoxAgain(){
    this.openDialog();
  }
  sendEvaluateData(e: EvaluationModel){
    console.log('parent component ',e);
    this.evaluateResponse = e;
    this.evaluate = true;
  }
  sendTestData(e: number){
    this.test = e;
  }
  addedCustomNeuronsOnLayer(e:number[]){
    this.customNeuronNumberAddedOnLayer= e;
  }

}
