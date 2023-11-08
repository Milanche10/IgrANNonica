import { EventEmitter, Injectable, Output } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'app/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class OutputVisualizerService {
  public data: IEpoch[] = [];
  public indexWhereTrainingStarted : number = 0;
  epoch : number = 0;
  // public connectionId :string ='';
  @Output() reDrawEvent : EventEmitter<IEpoch[]> = new EventEmitter<IEpoch[]>();
  connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl(ConstantsService.port + "hub", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
    })
    .build();
  private baseUrl: String = ConstantsService.baseURL + "ML/";
  constructor(private http: HttpClient) { }

  startConnection(index: number) {
    console.log('usao u start connection');
    this.indexWhereTrainingStarted = index;
    this.epoch = 0;
    this.data = [];
    this.connection.start().then(function () {
      console.log('SignalR Connected');
    }).then(() => this.getConnectionId())
      .catch(function (err) {
        return console.error('Error while starting connection: ' + err.toString());
      });

    this.connection.on("Data", (data) => {
      //dont look at this code
      this.epoch+=1;
      console.log(data, typeof(data));
      let temp: IEpoch = { loss: 0, val_loss: 0, epoch: this.epoch };
      const a = data.split(', ');
      a.forEach((b: string) => {
        const c = <any>b.split(': ');
        let pom = c[0].replaceAll('{', '').replaceAll('\'', '');
        let value = Number(c[1]);
        if (pom == '\"loss') {
          temp.loss = value;
        } else if (pom == 'val_loss') {
          temp.val_loss = value;
        } else if (pom == 'accuracy'){
          temp.accuracy = value;
        } else if (pom == 'mae'){
          temp.mae = value;
        }else if (pom == 'recall'){
          temp.recall = value;
        }else if (pom == 'mse'){
          temp.mse = value;
        }else if (pom == 'precision'){
          temp.precision = value;
        }else if (pom == 'root_mean_squared_error'){
          temp.rmse = value;
        }else if (pom == 'auc_1'){
          temp.auc = value;
        }
      });
      //now you can look at the code again
      // temp.loss = data.loss;
      // temp.val_loss = data.val_loss;
      if(data!='Model training completed'){
        this.data.push(temp);
        this.reDrawEvent.emit(this.data);
      }
    });
  }

  ngOnInit() {

  }

  closeConnection(){
    this.connection.stop();
    console.log('connection stopped');  
  }

  public getConnectionId = () => {
    this.connection.invoke('getconnectionid', localStorage.getItem('token')).then(
      (data) => {
        console.log(data);
        // this.connectionId = data;
      }
    );
  }
}

export interface IEpoch {
  val_loss: number;
  loss: number;
  epoch: number;
  // val_accuracy?: number;
  accuracy?: number;
  mae?: number;
  mse?: number;
  recall?: number;
  precision?: number;
  rmse?: number;
  auc?: number;
}