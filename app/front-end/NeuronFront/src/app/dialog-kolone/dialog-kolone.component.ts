import { Component, OnInit,ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DatasetoperationsService } from 'app/datasetoperations/service/datasetoperations.service';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'app/constants/constants.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-kolone',
  templateUrl: './dialog-kolone.component.html',
  styleUrls: ['./dialog-kolone.component.css']
})
export class DialogKoloneComponent implements OnInit {
  private baseUrl:String = ConstantsService.baseURL + "ML/"; 
  constructor(public fileUploadS:FileuploadService,public dataOperationS:DatasetoperationsService,private http:HttpClient,private dialogRef:MatDialogRef<DialogKoloneComponent>) { 
  }
  ngOnInit(){

  }
  salji(){
    this.dialogRef.close('yes');
  }
  odustani(){
    this.dialogRef.close('no');
  }
}
