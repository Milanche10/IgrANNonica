import { Component, OnInit } from '@angular/core';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';
import { StatistikaService } from './services/statistika.service';

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.component.html',
  styleUrls: ['./statistika.component.css']
})
export class StatistikaComponent implements OnInit {

  constructor(public statistikaS:StatistikaService, public fileUploadS:FileuploadService) { }
   matrica:boolean=true;
   metrika:boolean=false;
  ngOnInit(): void {
  }
  
}
