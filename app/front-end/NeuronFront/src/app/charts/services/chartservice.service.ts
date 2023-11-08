import { Injectable } from '@angular/core';
import { FileuploadService } from 'app/fileupload/service/fileupload.service';

@Injectable({
  providedIn: 'root'
})
export class ChartserviceService {
  public box:boolean=false;
  public bar:boolean=false;
  public data:any=[];
  constructor(public fileUploadS:FileuploadService) { }
  prikaz_Grafika(id:number){
    this.obrisi();
    this.bar=false;
    this.box=false;
   let niz:any=[];
   let series1=[];
   let name=this.fileUploadS.kolone[0][id];
   for(let i=0;i<this.fileUploadS.redovi[0].length;i++)
   niz.push(this.fileUploadS.redovi[0][i][id]);
 
   let kategorije=this.pronadjiJedinstvene(niz);
   if(kategorije.length > 20){
     series1=[];
     for(let i=0;i<this.fileUploadS.redovi[0].length;i++)
     {
       series1.push({"value":this.fileUploadS.redovi[0][i][id]});
     }
     this.data.push({"name":name, series:series1});
     this.box=true;
   }
   else {
     for(let j=0; j<kategorije.length;j++){
       name=kategorije[j];
       
       this.data.push({"name":name, "value":this.prebroj(id,name)});
     }
     this.bar=true;
   }
   
  }
  pronadjiJedinstvene(niz:any){
    const categories = niz.filter((value:any, index:any, categoryArray:any) => categoryArray.indexOf(value) === index);
    return categories;
    
  }
  obrisi(){
    this.data=[];
  }
  ponisti(){
    this.box=false;
    this.bar=false;
    this.obrisi();
  }
  prebroj(id:number, value:string){
    let br=0;
    for(let i=0;i<this.fileUploadS.redovi[0].length;i++){
      if(this.fileUploadS.redovi[0][i][id]==value) br++;
    }
    return br;
  }
}
