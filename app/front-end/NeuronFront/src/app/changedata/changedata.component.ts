import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-changedata',
  templateUrl: './changedata.component.html',
  styleUrls: ['./changedata.component.css']
})
export class ChangedataComponent implements OnInit {
  
  private obj : any = 0;
  isVisible:boolean = false;

  @Output() editEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() submitEvent: EventEmitter<string> = new EventEmitter<string>();

  
  constructor() { }


  ngOnInit(): void {
  }

  edit(){
  this.editEvent.emit("Edit"); 
  this.isVisible = true;
  }
  delete(){
    this.deleteEvent.emit("Delete"); 
  }
  submit(){
    this.submitEvent.emit("Submit"); 
    this.isVisible=false;
  }

}
