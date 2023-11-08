import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-singleneuron',
  templateUrl: './singleneuron.component.html',
  styleUrls: ['./singleneuron.component.css']
})
export class SingleneuronComponent implements OnInit {

  @Output() InputOutputCoordinatesForLines : EventEmitter<number[]> = new EventEmitter();
  private elementInited$ = new Subject();
    public desiredElement: ElementRef | undefined;
    @ViewChild('ab') set setElementRef(el: ElementRef) {
      if (!!el) {
        this.desiredElement= el;
        this.elementInited$.next(true);
    }
  }

  constructor() { }

  ngOnInit(): void {
    this.elementInited$.subscribe((inited) => {
      console.log(this.desiredElement?.nativeElement.getBoundingClientRect());
      })
  }

}
