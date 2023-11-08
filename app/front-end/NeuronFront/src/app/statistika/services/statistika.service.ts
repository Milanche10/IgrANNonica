import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'app/constants/constants.service';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';

@Injectable({
  providedIn: 'root'
})
export class StatistikaService{
  koloneH_1:any = [];
  redoviR_1:any = [];
  koloneH_2:any = [];
  redoviR_2:any = [];
  display:boolean=false;
  statistika:boolean=false;


  constructor(private http:HttpClient, private fileUploadS:FileuploadService) { }
  PromenaFajla(){
    this.koloneH_1=[];
    this.koloneH_2=[];
    this.redoviR_1=[];
    this.redoviR_2=[];
  }
  prikaziStatistiku(file:File){
    const fileData=new FormData();
    
    fileData.append('file', file,file.name);
    
    
    
    this.http.post(ConstantsService.baseURL+'ML/getStatistics',fileData).subscribe((res:any)=>{console.log(res);
    let niz_1=res[0];
    let niz_2=res[1];
    let linije=[];
    this.PromenaFajla();
    linije = niz_1.split('\n');
    let data = linije[0].split(',');
    
   
    this.koloneH_1.push(data);
    let nizR = [];
    let br = linije.length;
    let rows = [];
    for(let i = 1; i < br-1; i++){
    rows.push(linije[i].replace(", "," ").split(","));
   
    }
    
    
    for (let j = 0; j < rows.length; j++) {

      nizR.push(rows[j]);
        
    }
    this.redoviR_1.push(nizR);
    

    this.display=true;
    linije = niz_2.split('\n');
    
    data = linije[0].split(',');
    this.koloneH_2.push(data);
    nizR = [];
    br = linije.length;
    rows = [];
    for(let i = 1; i < br-1; i++){
    rows.push(linije[i].replace(", "," ").split(","));
   
    }
    for (let j = 0; j < rows.length; j++) {

      nizR.push(rows[j]);
        
    }
    this.redoviR_2.push(nizR);
    this.fileUploadS.prikaziTabelu(1);
  }
  );   
}
}
