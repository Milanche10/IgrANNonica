import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-changeamount',
  templateUrl: './changeamount.component.html',
  styleUrls: ['./changeamount.component.css']
})
export class ChangeamountComponent implements OnInit {

  @Input() title: string = '';
  @Input() isMinusEnabled: boolean = true;
  @Input() isPlusEnabled: boolean = true;
  @Output() plusEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() minusEvent: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }
  onPlusClick(){
    this.plusEvent.emit("Plus");
  }

  onMinusClick(){
    this.minusEvent.emit("Minus");
  }
}
