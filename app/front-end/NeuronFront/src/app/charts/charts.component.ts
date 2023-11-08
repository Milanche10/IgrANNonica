import { Component, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { LegendPosition } from '@swimlane/ngx-charts';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';
import { ChartserviceService } from './services/chartservice.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  ngOnInit(): void {
  }
  redovi:any;
  kolone:any;
  data:any=[];
  view:any= [,];
  width: number = 700;
  height: number = 300;
  schemeType = ScaleType.Ordinal;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legenda';
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Pol';
  showYAxisLabel = true;
  yAxisLabel = 'Godine';
  showGridLines = true;
  roundEdges: boolean = true;
  roundDomains = false;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin:any=0;
  yScaleMax:any=0;
  showDataLabel: boolean = false;
  strokeColor: string = '#000000';
  strokeWidth: number = 3;
  legendPosition = LegendPosition.Right;
  colorSets: any;
  colorScheme: any;
  constructor(private fileUploadS: FileuploadService, public chartS:ChartserviceService) { }
onSelect(event:any) {
  console.log(event);
}
}
