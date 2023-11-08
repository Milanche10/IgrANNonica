import { E } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
// import {ConnectedScatterplot} from "@d3/connected-scatterplot";
import { IEpoch, OutputVisualizerService } from './service/output-visualizer.service';
// import Chart from 'chart.js';

@Component({
  selector: 'app-output-visualizer',
  templateUrl: './output-visualizer.component.html',
  styleUrls: ['./output-visualizer.component.css']
})
export class OutputVisualizerComponent implements OnInit {

  private _startTraining: number = -1;
  public keptData: IEpoch[] = [];
  private keptDataBool: boolean = false;
  @Input() metrics: string[] = [];
  @Input() BatchSize: number = 0;
  // @Input() set keptData(value: string[]){
  //   this._keptData=value;
  // }
  // get keptData():string[]{
  //   return this._keptData;
  //   // return [];
  // }
  //linechart
  data15: IEpoch[] = [
    {val_loss:0, loss:70, epoch: 1},
    { val_loss: 1, loss: 80, epoch: 2 },
    { val_loss: 2, loss: 90, epoch: 3 },
    { val_loss: 3, loss: 95, epoch: 4 },
    { val_loss: 4, loss: 100, epoch: 5 },
    { val_loss: 5, loss: 110, epoch: 6 },
    { val_loss: 6, loss: 110, epoch: 7 },
    { val_loss: 7, loss: 130, epoch: 8 },
    { val_loss: 8, loss: 110, epoch: 9 },
    { val_loss: 9, loss: 150, epoch: 10 },
    { val_loss: 10, loss: 120, epoch: 11},
    { val_loss: 11, loss: 170, epoch: 12},
    { val_loss: 12, loss: 100, epoch: 13},
    { val_loss: 13, loss: 140, epoch: 14}
  ];
  // public myIndex: number = 0;
  @Input()
  set startTraining(value: number) {
    this._startTraining = value;
    if (value !== -1 && !sessionStorage.getItem('trainingOnModel'+value)) {
    // if(value !== -1){  
      console.log(value);
      // this.myIndex = value;
      sessionStorage.setItem('trainingOnModel'+this.startTraining,[this.BatchSize].toString());
      this.outputVisualizerService.startConnection(value);
    }
  }
  get startTraining() {
    return this._startTraining;
  }
  // @Input() isSelected: boolean = false;
  @Input() lastEpoch: number = 0;
  // @Input() modelName: string = '';
  
  
  title = 'Neimenovani Model';

  constructor(public outputVisualizerService: OutputVisualizerService) {
  }
  ngOnInit() {
    this.outputVisualizerService.reDrawEvent.subscribe((data) => {
      if (!this.keptDataBool) {
        this.loadChart(data);
        if (data.length == this.lastEpoch) {
          this.outputVisualizerService.closeConnection();
          var text = '';
          data.forEach(element => {
            text+='epoch:'+element.epoch+',';
            text+='loss:'+element.loss+',';
            text+='val_loss:'+element.val_loss+',';
            if(element.mae!=undefined){
              text+='mae:'+element.mae+',';
            }
            if(element.mse!=undefined){
              text+='mse:'+element.mse+',';
            }
            if(element.accuracy!=undefined){
              text+='accuracy:'+element.accuracy+',';
            }
            if(element.auc!=undefined){
              text+='auc:'+element.auc+',';
            }
            if(element.precision!=undefined){
              text+='precision:'+element.precision+',';
            }
            if(element.rmse!=undefined){
              text+='rmse:'+element.rmse+',';
            }
            if(element.recall!=undefined){
              text+='recall:'+element.recall+',';
            }
            text+='|';
            // mae:15,acc:23|mae:32,mse:24|acc:34,mae:23
          });
          console.log(text);
          sessionStorage.setItem('graphData'+this.startTraining,text);
          // this.keptData = data;
          // data.forEach(element=>{
            // this._keptData.push(<JSON>element);
            // JSON value['epoch'] = element.epoch;
            // var arrayObject = "{\"epoch\" : "+ element.epoch+",\"loss\" : "+element.loss+",\"val_loss\" : "+element.val_loss+",\"auc\" : "+element.auc+",\"accuracy\" : "+element.accuracy+",\"mae\" : "+element.mae+",\"mse\" : "+element.mse+",\"rmse\" : "+element.rmse+",\"recall\" : "+element.recall+",\"precision\" : "+element.precision+"};";
            // this.keptData.push(arrayObject);
            // });
            // sessionStorage.setItem('graphDataOnModel'+this.startTraining, this.keptData.toString());
            // console.log(this.keptData);
          }
        }
    });
  }
  
  ngAfterViewInit(){
    this.showOldChart();
  }

  showOldChart(){
    var fromSession = JSON.parse(sessionStorage.getItem('model'+this.startTraining) || '');
    this.metrics = fromSession['Metrics'];
    if(sessionStorage.getItem('trainingOnModel'+this.startTraining)!=undefined){
      //open data from graphs
      var text = sessionStorage.getItem('graphData'+this.startTraining) || '';
      if(text!=''){
        var textualdata = text?.split('|') || [''];
        textualdata.forEach(element => {
          let i = element.split(',') || [''];
          let temp = <IEpoch>{};
          i.forEach(el => {
            let a = el.split(':');
            if(a!=['']){
              if(a[0]=='epoch'){
                temp.epoch = Number(a[1]);
              }
              if(a[0]=='loss'){
                temp.loss = Number(a[1]);
              }
              if(a[0]=='val_loss'){
                temp.val_loss = Number(a[1]);
              }
              if(a[0]=='mae'){
                temp.mae = Number(a[1]);
              }
              if(a[0]=='mse'){
                temp.mse = Number(a[1]);
              }
              if(a[0]=='rmse'){
                temp.rmse = Number(a[1]);
              }
              if(a[0]=='auc'){
                temp.auc = Number(a[1]);
              }
              if(a[0]=='accuracy'){
                temp.accuracy = Number(a[1]);
              }
              if(a[0]=='precision'){
                temp.precision = Number(a[1]);
              }
              if(a[0]=='recall'){
                temp.recall = Number(a[1]);
              }
            }
          });
          this.keptData.push(temp);          
        });
        this.loadChart([]);
      }
    }
    
  }

  checkMyIndex(i: number){
    if(this.startTraining==i){
      return true;
    } else{
      return false;
    }
  }
  
  loadChart(visualizationData : IEpoch[]){
    var labelsLoss : number[] = [];
    var labelsValLoss : number[] = [];
    var labelsMae : number[] = [];
    var labelsAccuracy : number[] = [];
    var labelsMse : number[] = [];
    var labelsPrecision : number[] = [];
    var labelsRecall : number[] = [];
    var labelsAuc : number[] = [];
    var labelsRmse : number[] = [];

    if(visualizationData.length==0){
      visualizationData = this.keptData.splice(0,this.keptData.length-1);
    }
    var data :string[] = [];
    visualizationData.forEach(element => { //visualizationData
      labelsLoss.push(element.loss);
      labelsAccuracy.push(Number(element.accuracy)); //! what do i do with you??
      labelsMae.push(Number(element.mae));
      labelsMse.push(Number(element.mse));
      labelsPrecision.push(Number(element.precision));
      labelsRecall.push(Number(element.recall));
      labelsAuc.push(Number(element.auc));
      labelsRmse.push(Number(element.rmse));
      labelsValLoss.push(element.val_loss);
      if(element.epoch!=undefined){
        data.push(element.epoch.toString());
      }
    });
    var ctx :any = document.getElementById("chart1"+this.startTraining);
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          { 
            data: labelsLoss,
            label: 'Loss value',
            borderColor:"#FFF275",
            lineTension:0.2
          },
          {
            data: labelsValLoss,
            label: 'Val Loss value',
            borderColor:"#007bff",
            lineTension:0.2
          }
        ],
        labels: data
      }
    });
    var ctx: any = document.getElementById("chart2" + this.startTraining);
    var datasets: any[] = [];
    this.metrics.forEach(element => {
      switch (element) {
        case 'mae':
          datasets.push({
            data: labelsMae,
            label: 'Mae value',
            borderColor: "#FFF275",
            lineTension: 0.2
          });
          break;
        case 'mse':
          datasets.push(
            {
              data: labelsMse,
              label: 'Mse value',
              borderColor: "#FF8C42",
              lineTension: 0.2
            });
          break;
        case 'accuracy':
          datasets.push(
            {
              data: labelsAccuracy,
              label: 'Accuracy value',
              borderColor: "#6699CC",
              lineTension: 0.2
            });
          break;
        case 'precision':
          datasets.push({
            data: labelsPrecision,
            label: 'Precision value',
            borderColor: "#8DB0B7",
            lineTension: 0.2
          });
          break;
        case 'recall':
          datasets.push(
            {
              data: labelsRecall,
              label: 'Recall value',
              borderColor: "#A23E48",
              lineTension: 0.2
            });
          break;
        case 'auc':
          datasets.push(
            {
              data: labelsAuc,
              label: 'Auc value',
              borderColor: "#FFBF5C",
              lineTension: 0.2
            });
          break;
        case 'rmse':
          datasets.push({
            data: labelsRmse,
            label: 'Rmse value',
            borderColor: "#8DB0B7",
            lineTension: 0.2
          });
          break;
        default:
          break;
      }
    });
    var myChart = new Chart(ctx, {
            type: 'line',
            data: {
              datasets: 
              datasets,
              labels: data
            }
          });
  }
}

