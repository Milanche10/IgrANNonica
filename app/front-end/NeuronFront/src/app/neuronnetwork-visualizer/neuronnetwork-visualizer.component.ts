import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-neuronnetwork-visualizer',
  templateUrl: './neuronnetwork-visualizer.component.html',
  styleUrls: ['./neuronnetwork-visualizer.component.css']
})
export class NeuronnetworkVisualizerComponent implements OnInit {

  value : number =  0;
  @Input() numberOfLayers : number = 0;
  @Input() numberOfNeuronsPerLayer : any = [];
  @Input() disableButtons : boolean = false;
  @Input() outputLayer : number = 0;
  @Output() plusOneNeuronInThisLayer: EventEmitter<number> = new EventEmitter();
  @Output() minusOneNeuronInThisLayer: EventEmitter<number> = new EventEmitter();
  @Output() customNumberOfNeuronsInThisLayer: EventEmitter<number[]> = new EventEmitter();
  

  constructor() { }

  ngOnInit(): void {
  }

  onPlusEventInLayer(i : number){
    this.plusOneNeuronInThisLayer.emit(i);
  }
  onMinusEventInLayer(i : number){
    this.minusOneNeuronInThisLayer.emit(i);
  }
  toggleDisableButtonsFromControls(){
    this.disableButtons = this.disableButtons;
  }
  onFocused(i:number){
    this.numberOfNeuronsPerLayer[i] = this.value-1;
    this.value = 0;
    // this.customNumberOfNeuronsInThisLayer.emit([i, this.value]);
    this.plusOneNeuronInThisLayer.emit(i);
  }
}
