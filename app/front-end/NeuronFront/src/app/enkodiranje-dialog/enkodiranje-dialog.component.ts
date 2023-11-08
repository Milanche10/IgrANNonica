import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConstantsService } from 'app/constants/constants.service';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';

@Component({
  selector: 'app-enkodiranje-dialog',
  templateUrl: './enkodiranje-dialog.component.html',
  styleUrls: ['./enkodiranje-dialog.component.css']
})
export class EnkodiranjeDialogComponent implements OnInit {
  kolone:any;
  redovi:any;
  naziv:string="";
  kolona_prikaz:any=[];
  prikazi_kolonu:boolean=false;
  data:any=[];
  private baseUrl:String = ConstantsService.baseURL; 
  constructor(public fileUploadS:FileuploadService,private http:HttpClient, private dialogRef:MatDialogRef<EnkodiranjeDialogComponent>) { 
  }

  ngOnInit(): void {
   
  }
  SrediPodatke()
  {

      this.dialogRef.close('yes');
  }
  ponisti(){
    this.dialogRef.close('no');
}
}
