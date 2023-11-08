import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TabledisplayService } from './service/tabledisplay.service';

@Component({
  selector: 'app-tabledisplay',
  templateUrl: './tabledisplay.component.html',
  styleUrls: ['./tabledisplay.component.css']
})
export class TabledisplayComponent implements OnInit {
  items:any=[];
  display : boolean = false;
  kljucevi:any=[];
  constructor(private tabledisplayService: TabledisplayService) { }

  ngOnInit(): void {
  }

  

}
