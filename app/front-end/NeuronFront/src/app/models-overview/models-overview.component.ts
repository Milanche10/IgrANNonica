import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingScreenServiceService } from 'app/loadingScreen/loading-screen-service.service';

@Component({
  selector: 'app-models-overview',
  templateUrl: './models-overview.component.html',
  styleUrls: ['./models-overview.component.css']
})
export class ModelsOverviewComponent implements OnInit {

  private _valueOfChangedIndex: number = -1;

  @Input()
  set valueOfChangedIndex(value: number) {
    this._valueOfChangedIndex = value;
    if (value !== -1) {
      console.log(value);
    }
  }
  get valueOfChangedIndex() {
    return this._valueOfChangedIndex;
  }
  @Input() numberOfModels : number = 1;
  @Input() selectedIndex : number = 0;
  @Input() modelList : string[] = [];
  @Output() clickedOnModel : EventEmitter<number> = new EventEmitter<number>();
  // changingValue: Subject<number> = new Subject();
  constructor(public LoadingScreenService : LoadingScreenServiceService) { }

  ngOnInit(){}

  clickedOnModelButton(i : number){
    this.selectedIndex = i;
    this.clickedOnModel.emit(i);
  }
  
}
