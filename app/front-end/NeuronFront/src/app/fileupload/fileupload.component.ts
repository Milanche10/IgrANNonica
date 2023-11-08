import { HttpClient } from '@angular/common/http';
import { Component, OnInit,Inject } from '@angular/core';
import { StatistikaService } from '../statistika/services/statistika.service';
import { DatasetoperationsService } from 'app/datasetoperations/service/datasetoperations.service';
import { FileuploadService } from './service/fileupload.service';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { DialogKoloneComponent } from 'app/dialog-kolone/dialog-kolone.component';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ChartserviceService } from 'app/charts/services/chartservice.service';
import { ConstantsService } from 'app/constants/constants.service';
import { I } from '@angular/cdk/keycodes';
import { EnkodiranjeDialogComponent } from 'app/enkodiranje-dialog/enkodiranje-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  filename:any;
  //indGrafik: boolean = false; 
  items: Array<string>=[];
  sredi:boolean=false;
  fajl_prikaz:boolean=false;
  graf:boolean=false;
  izbor_kolona:boolean=false;
  //inputoutput:boolean=true;
  //klik:boolean=false;
  //encode:boolean=false;
  //scale:boolean=false;
  jeste_broj:boolean=false;//za_grafike
  ocisceno:boolean=false;
  prazno_ciscenje:boolean=false;
  
  //koloneH:any = [];
  //redoviR:any = [];
  //help_arr1:any = [];
  //help_arr2:any = [];
  za_ciscenje:any=[];
  file:any;
  
  //pageNumber: number = 0;
  //display:boolean=false;
  statistika:boolean=false;
  //encoded:boolean=false;
  private baseUrl:String = ConstantsService.baseURL; 
  constructor(public fileUploadS:FileuploadService,public dialog: MatDialog,private statistikaservis:StatistikaService, private router:Router, private http:HttpClient,private dataOperationS:DatasetoperationsService,private chartS:ChartserviceService,private sanitzer:DomSanitizer){}
  
  ngOnInit(): void {
    this.file=null;
    this.ocisceno=false;
    this.prazno_ciscenje=false;
    this.fileUploadS.isLoading=false;
    this.fileUploadS.problem_nedostajuce=false;

    if(!localStorage.getItem('token'))
      this.router.navigate(['/']); 
  }
  
 /* prikazJson_kao_tabelu(podaci:any){
    this.help_arr1=[];
    this.help_arr2=[];
    podaci.forEach((element:any) => {
      this.help_arr1=Object.keys(element);
      this.help_arr2.push(Object.values(element));
    });
    this.ngOnInit();
    
  }*/
  fileUpload(event:any){
    this.ngOnInit();
    this.fileUploadS.izabrano_jednom=false;
    this.fileUploadS.display=false;
    const target=event.target;
    
      this.file=(target.files as FileList)[0];
      this.filename=this.file.name;
      this.fileUploadS.isLoading=true;
      this.PrikaziStatistiku();
  }
  IzborFajla (){
    let element:HTMLElement=document.getElementById('getFile') as HTMLElement;
    element.click();
  }

  onEditEvent( id : number){
    this.fileUploadS.onEditEvent(id);
    
  }
  /*onDeleteEvent( id: number, p:number){
      console.log(this.redoviR);
      console.log(id,p);
      // this.redoviR.splice(id+p,1);
      console.log(this.redoviR);
  }*/

  onSubmitEvent(id : number, value:any,j:number){
    this.fileUploadS.onSubmitEvent(id, value, j);
  }
  Close(ch:any,i:number,j:number){
   this.fileUploadS.Close(ch,i,j);
  }
  Edit(i:number, j:number){
    this.fileUploadS.Edit(i,j);
  }
  PrikaziStatistiku(){
    if(this.file!=null){
      this.statistikaservis.prikaziStatistiku(this.file);
      this.statistika=true;
      //staviti prazan niz 
    }
  }

  goTo(){
    this.router.navigate([`./neuronnetwork`,2,3]).then(
      ()=>{}
    );
    }
postaviPoruku(){
  this.fileUploadS.message_dialog="Potvrda izabranih opcija se može izvršiti samo jednom!";
  this.fileUploadS.problem_nedostajuce=false;
}
openDialog() {
  const dialogRef = this.dialog.open(DialogKoloneComponent);
  
  dialogRef.afterClosed().subscribe(result => {
    if(result=="yes")
    {
      console.log(result)
      this.fileUploadS.SacuvajSve()
    }
  });
}
openDialogEN(){
  const dialogRef = this.dialog.open(EnkodiranjeDialogComponent);
  
  dialogRef.afterClosed().subscribe(result =>{
  });
}
ObrisiKolonu(id:number){
  const dialogRef = this.dialog.open(EnkodiranjeDialogComponent);
  
  dialogRef.afterClosed().subscribe(result =>{
    console.log("Rezultat odgovora:"+ result);
    if(result=="yes"){
      this.fileUploadS.obrisi_Kolonu(id);
    }
  });
 
}

obrisiRed(id:number){
  let niz:any=[];
  if(!this.fileUploadS.izmena_u_toku){
  id=this.fileUploadS.pageNumber-1 + id;
  niz.push(id);
  const dialogRef = this.dialog.open(EnkodiranjeDialogComponent);
  
  dialogRef.afterClosed().subscribe(result =>{
    console.log("Rezultat odgovora:"+ result);
    if(result=="yes"){
      this.http.post<any>(this.baseUrl+"ML/updateData",{"RemoveRows":niz}).subscribe((result:any) => {  
  
          this.fileUploadS.prikazJson_kao_tabelu(JSON.parse(result.Data));
          this.fileUploadS.brojPodataka=result.MaxPages;
      });
    }
  });
}
}

//items_left:any=[];

//items_right = [{"key":-1, "value":""}];

/*  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
    
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if(this.items_right.length==1 && this.items_right[0].value==''){ this.items_right.splice(0,1);}
      
      transferArrayItem(
        
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      
      this.items_right=this.getItems();
      this.prikazi_sliku=false;
     /* if(this.items_right.length>0)
      this.chartS.prikaz_Grafika(this.items_right[0].key);
      else
      this.chartS.ponisti();
    */
  //}
  //}
  //stara_duzina:number=0;
 /* getItems(){
    let niz=[];
    if(this.items_right.length>2){
    niz.push(this.items_right[0]);
    niz.push(this.items_right[1]);
    this.items_left.push(this.items_right[2]);
    return niz;
    }
    console.log("desni");
    console.log(this.items_right);
    return this.items_right;
  }*/
  SrediPodatke()
  {
    this.ocisceno=false;
    let cekirane:any=[];
    let opcije:any=[];
    let name;
    let setEmpty:any=[];
    let RemoveOutlier:any=[];
    let fillNaNMean:any=[];
    let fillNaNMod:any=[];
    let RemoveNaN:any=[];
    cekirane=document.getElementsByName('clean');
    for(let i=0;i<cekirane.length;i++){
      if(cekirane[i].checked){
        name="option"+i;
        opcije=document.getElementsByName(name);
        if(opcije[0].checked){
          setEmpty.push(this.fileUploadS.kolone[0][i]);
        }
        if(opcije[1].checked){
          RemoveNaN.push(this.fileUploadS.kolone[0][i]);
        }
        if(opcije[2].checked){
          RemoveOutlier.push(this.fileUploadS.kolone[0][i]);
        }
        if(opcije[3].checked){
          fillNaNMean.push(this.fileUploadS.kolone[0][i]);
        }
        if(opcije[4].checked){
          fillNaNMod.push(this.fileUploadS.kolone[0][i]);
        }
      }
    }
    if(RemoveOutlier.length!=0 || setEmpty.length!=0 || RemoveNaN.length!=0 || fillNaNMean.length!=0 || fillNaNMod.length!=0){
    this.http.post<any>(this.baseUrl + "ML/cleanData", { "RemoveOutlier":RemoveOutlier, "SetEmptyToNaN":setEmpty, "RemoveNaN":RemoveNaN,"FillNaN" : {"FillWithMode" : fillNaNMod, "FillWithMean" : fillNaNMean}}).subscribe((result: any) => {
      console.log("rezultat");
      console.log(JSON.parse(result.Data));
      this.ocisceno=true;
      this.fileUploadS.brojPodataka=result.MaxPages;
      this.prazno_ciscenje=false;
      //this.za_ciscenje=[];
      this.fileUploadS.prikazJson_kao_tabelu(JSON.parse(result.Data));
      

    });
  }
  else {
    this.prazno_ciscenje=true;
    this.ocisceno=false;
  }
  }
  Odabrano_ciscenje(event:any){
    if (!(event.currentTarget.value in this.za_ciscenje) && event.currentTarget.checked){
      this.za_ciscenje.push(event.currentTarget.value); 
    }
    else {
      const index = this.za_ciscenje.findIndex((x:any) => x === event.target.value);
      this.za_ciscenje.splice(index,1); 
    }
  }
  prikazi_sliku:boolean=false;
  image:any;
  Iscrtavanje(prva:string, type:string="", druga:string=""){
    let tip="";
    let slanje:any;
   console.log(prva+" "+druga);
    if(type=="Violin dijagram") tip="Violin";
    else if(type=="Boxplot") tip="Boxplot";
    else tip="Hist";
    let objekat={"X":prva, "Type":tip};
    let objekat2={"X":prva, "Y":druga};
    if(druga!="") slanje=objekat2;
    else slanje=objekat;
    this.http.post(this.baseUrl + "ML/drawPlot", slanje,{ responseType: 'blob' }).subscribe((result: any) => {
      let objectURL = URL.createObjectURL(result);       
      this.image = this.sanitzer.bypassSecurityTrustUrl(objectURL);
      console.log(objectURL);
      this.prikazi_sliku=true;
    });
  }
  pocetna:boolean=true;
  Nova()
  {
    if(this.pocetna){
      document.body.style.backgroundImage = "none";
    }
  }
  Prosiri(num:number){
    document.body.style.backgroundImage = "url('../../assets/img/profile-background.gif')";
    this.pocetna=false;
    this.fajl_prikaz=false;
    this.graf=false;
    this.izbor_kolona=false;
    if(num==1 || this.fileUploadS.display==false){
      this.fajl_prikaz=true;
      this.items = []; 
      this.za_ciscenje=[];
    }
    if(num==2 && this.fileUploadS.display==true){
      this.graf=true;
     // if(!this.indGrafik){
       /* for(let i=0;i<this.fileUploadS.kolone[0].length;i++)
          this.items_left.push({"key":i, "value":this.fileUploadS.kolone[0][i]});*/
        //this.indGrafik = true; 
      //}
    }
    if(num==3 && this.fileUploadS.display==true){
      console.log("usao")
      this.izbor_kolona=true;
      this.items = []; 
    }
   
   
  }
  lengthItems(){
    return this.items.length; 
  }
  checkItem(value:any):void {
    
    if (!(value.currentTarget.value in this.items) && value.currentTarget.checked){
      this.items.push(value.currentTarget.value);
      if(this.items.length==1){
       this.jeste_broj=this.fileUploadS.proveri_tip_podataka(Number(this.items[0]));
      }
    }
    else {
      const index = this.items.findIndex(x => x === value.target.value);
      this.items.splice(index,1); 
      if(this.items.length==1){
        this.jeste_broj=this.fileUploadS.proveri_tip_podataka(Number(this.items[0]));
       }
    }
  }
  drawGraphics(type:string){
    console.log(type); 
    if(this.lengthItems()>1)
      this.Iscrtavanje(this.fileUploadS.koloneIzbora[Number(this.items[0])].name,type,this.fileUploadS.koloneIzbora[Number(this.items[1])].name); 
    else 
      this.Iscrtavanje(this.fileUploadS.koloneIzbora[Number(this.items[0])].name,type); 
  }
  disableCheckbox(object:any){
    if((!object.checked) && (this.lengthItems() == 2))
      return true; 
    return false;
  }
}
/*export class mat{
  i:number;
  j:number;
  constructor()
  {
    this.i=0;
    this.j=0;
  }
}*/