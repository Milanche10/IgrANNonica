import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConstantsService } from 'app/constants/constants.service';
import { DatasetoperationsService } from 'app/datasetoperations/service/datasetoperations.service';
import { DialogKoloneComponent } from 'app/dialog-kolone/dialog-kolone.component';


@Injectable({
  providedIn: 'root'
})
export class FileuploadService{
  kolone:any;
  public redovi:any;
  public odredjen_inout:boolean=false;
  private help_arr1:any = [];
  private help_arr2:any = [];
 // ulazi_izlazi:any=[];
  private enkodiranjeKoloneOne:any=[];
  private enkodiranjeKoloneLabel:any=[];
  private standardize:any=[];
  private normalize:any=[];
  private minmax:any=[];
  private tipovi_kolona:any=[];
 // nazivi_kolona:any=[];
  updatedArray:any=[];
  isLoading:boolean=false;
  koloneIzbora:Array<KoloneIzbor>=new Array<KoloneIzbor>();

  display:boolean=false;
  izmena_u_toku:boolean=false;
  alert_in_out:boolean=false;
  isVisible:boolean = false;
  isItem:mat=new mat();
  alert_bad:boolean=false;
  alert_bad_format:boolean=false;
  problem_nedostajuce:boolean=false;
 
 
  pageNumber: number = 1;
  brojPodataka:number=1;
  enkodirano:boolean=false;
  skalirano:boolean=false;
  izabrano_jednom:boolean=false;
  message:string="";
  message_dialog:string="";

  
  private baseUrl:String = ConstantsService.baseURL; 
  constructor(private http : HttpClient, private dataOperationS:DatasetoperationsService, public dialog:MatDialog) { }
  pocetak(){
    this.kolone=[];
    this.redovi=[];
    this.display=false;
    this.enkodirano=false;
    this.skalirano=false;
    this.alert_in_out=false;
    this.alert_bad=false;
    this.message="";
    this.alert_bad_format=false;
    this.isLoading=false;
  }
  Next(){
    if(this.pageNumber<this.brojPodataka)
    {
      this.pageNumber+=1;
      this.prikaziTabelu();
    }
  }
  Previous(){
    if(this.pageNumber>1)
    {
      this.pageNumber-=1;
      this.prikaziTabelu();
    }
  }
  prikazJson_kao_tabelu(podaci:any, id:number=-1){
    this.help_arr1=[];
    this.help_arr2=[];
    podaci.forEach((element:any) => {
      this.help_arr1=Object.keys(element);
      this.help_arr2.push(Object.values(element));
    });
      this.pocetak();
      this.kolone.push(this.help_arr1);
      this.redovi.push(this.help_arr2);
     
      if(id==1)//prvi put se ucitava fajl
        this.dajTipoveKolona();
      
        this.display=true; 
        this.isLoading=false;
    }
 dajTipoveKolona(){
  this.http.post(this.baseUrl + "ML/suggestColumnTypes",{"t":"t"}, {responseType:'text'}).subscribe((result: any) => {
    this.procitajCSV(result,"suggest");
   });
}
private procitajCSV(result:any, za_sta:string){
  let nazivi:any=[];
  let tipovi:any=[];
  this.tipovi_kolona=[];
  let linije=[];
  linije = result.split('\n');
  let data = linije[0].split(',');
  nazivi.push(data);
  let br = linije.length;
  for(let i = 1; i < br-1; i++)
    tipovi.push(linije[i].replace(", "," ").split(","));
  
  for(let i=1;i<tipovi[0].length;i++)
  {
   this.tipovi_kolona.push({naziv:nazivi[0][i], tip:tipovi[0][i]}) 
  }
  if(za_sta=="suggest") this.kreirajKoloneIzbor();
  console.log(this.tipovi_kolona);
}
kreirajKoloneIzbor(){
    this.koloneIzbora=[];
    let kolona;
    for(let i=0;i<this.kolone[0].length;i++){
        kolona=new KoloneIzbor();
        kolona.id=i;
        kolona.name=this.kolone[0][i];
        if(this.tipovi_kolona[i].tip=="Numerical" || this.tipovi_kolona[i].tip=="Numerical\r"){
          kolona.tip="Numerička"
      }
        else{
          kolona.tip="Kategorijska";
          kolona.enkodiranje="Label encoding";
        } 
        if(this.tipovi_kolona[i].tip=="Not Recommended" || this.tipovi_kolona[i].tip=="Not Recommended\r"){
          kolona.tip_not=true;
        }
        if(i==this.kolone[0].length-1) {
          kolona.ulaz_izlaz="izlaz";
        }
        
        this.koloneIzbora.push(kolona);
      }
      this.odredi_originalni_tip();
    }
private odredi_originalni_tip(){
      this.http.post(this.baseUrl + "ML/getColumnTypes",{"t":"t"}, {responseType:'text'}).subscribe((result: any) => {
        this.procitajCSV(result,"original");
        for(let i=0;i<this.koloneIzbora.length;i++){
          if(this.tipovi_kolona[i].tip=='Numerical' || this.tipovi_kolona[i].tip=="Numerical\r"){
            this.koloneIzbora[i].tip_org="Numerička"
          }
          else
          this.koloneIzbora[i].tip_org="Kategorijska"
        }
        this.tipovi_kolona=[];
      });
    }
  odredi_input_output(input:any, output:any){
    this.http.post(this.baseUrl+"ML/splitInputsOutputs",{"SplitData":{"Inputs":input,"Outputs":output}}).subscribe((result:any) => {
    this.odredjen_inout=true;
    this.izabrano_jednom=true;
    this.problem_nedostajuce=false;
    if (this.enkodiranjeKoloneLabel.length > 0 || this.enkodiranjeKoloneOne.length > 0)
      this.odredi_kolone_za_enkodiranje();
    else if(this.normalize.length!=0 || this.standardize.length!=0 || this.minmax.length!=0){
      this.skaliraj();
    }
    this.message_dialog="Potvrda izabranih opcija se može izvršiti samo jednom!";
    },
    error=>{
     if(error!=null) {
       this.message_dialog="Vaši izabrani podaci sadrže nedostajuće vrednosti. Ne možete nastaviti dok u podacima imate nedostajuće vrednosti."
       this.problem_nedostajuce=true;
       const dialogRef = this.dialog.open(DialogKoloneComponent);
       dialogRef.afterClosed().subscribe(result => {});
     }
    });
    this.dataOperationS.funkcija({"Inputs":input,"Outputs":output});
}
prikaziTabelu(id:number=-1){
    this.http.post<any>(this.baseUrl + "ML/readFile",{"pageNum":this.pageNumber,"numOfRows":50} ).subscribe((result: any) => {
      this.brojPodataka=result.MaxPages;
      if(id==1){this.prikazJson_kao_tabelu(JSON.parse(result.Data),1);}
      else{
        this.prikazJson_kao_tabelu(JSON.parse(result.Data))
      }
      let s;
      if(this.updatedArray.length>0){
      
        for(let i=0;i<this.updatedArray.length;i++){
          s=this.updatedArray[i];
          if(this.pageNumber==s.PageNumber)
          {
            this.redovi[0][s.RowOrg][s.Col]=s.Value;
          }
        }
      }
    });
  }
  skaliraj()
  {
    console.log(this.standardize);
    console.log(this.normalize);
    console.log(this.minmax);
    if(this.standardize.length!=0 || this.normalize.length!=0 || this.minmax.length!=0)
    {this.http.post(this.baseUrl+"ML/scaleData",{"Standardize":this.standardize,"Normalize":this.normalize,"MinMaxScale":this.minmax},{observe: 'response'}).subscribe((result:any) => {
      this.prikazJson_kao_tabelu(result.body);
      console.log(result.text);
      this.skalirano=true;
      if (this.enkodiranjeKoloneLabel.length > 0 || this.enkodiranjeKoloneOne.length > 0) this.enkodirano=true;
      this.pageNumber=1;
    });
    console.log({"Standardize":this.standardize,"Normalize":this.normalize,"MinMaxScale":this.minmax})
  }
  }
  odredi_kolone_za_enkodiranje(){
    console.log("Label");
    console.log(this.enkodiranjeKoloneLabel);
    console.log(this.enkodiranjeKoloneOne);
      this.http.post<any>(this.baseUrl + "ML/encodeData", { "LabelEncode": this.enkodiranjeKoloneLabel, "OneHotEncode": this.enkodiranjeKoloneOne },{observe: 'response'}).subscribe((result: any) => {
        this.prikazJson_kao_tabelu(result.body);
        this.enkodirano=true;
        if(result.status==200)
        {
          this.skaliraj();
        }
        this.pageNumber=1;
      });
}
  obrisi_Kolonu(id:number){
    let niz:any=[];
    niz.push(this.kolone[0][id]);
    this.http.post<any>(this.baseUrl+"ML/updateData",{"RemoveColumns":niz}).subscribe((result:any) => {  
    this.prikazJson_kao_tabelu(JSON.parse(result.Data),1);
    this.pageNumber=1;
  });
  }
  onSubmitEvent(id : number, value:any,j:number){
    if(isNaN(Number(value)) && this.proveri_tip_podataka(j)){
      this.message="Ne može se nenumerička vrednost uneti među numeričke podatke!"
      this.alert_bad_format=true;
    }
    else{
      this.isVisible = false;
      this.redovi[0][id][j]=value;
      let org=id;
      id=(this.pageNumber-1)*this.redovi[0].length+id;
      this.updatedArray.push({Row:id, Col:j, Value:value, PageNumber:this.pageNumber, RowOrg:org});
      this.izmena_u_toku=true;
      this.alert_bad_format=false;  
    }
  }
  Close(ch:any,i:number,j:number){
    ch.value=this.redovi[0][i][j];
    this.isVisible = false;
  }
  Edit(i:number, j:number){
    this.isItem.i=i;
    this.isItem.j=j;
    this.isVisible=true;
  }
  onEditEvent( id : number){
    this.isVisible = true;
  }

  cuvanjeIzmenaCelija(){
    this.http.post<any>(this.baseUrl+"ML/updateData",{"UpdateCells":this.updatedArray}).subscribe((result:any) => {  
    this.prikazJson_kao_tabelu(JSON.parse(result.Data));
    this.updatedArray=[];
    this.pageNumber=1;
    this.izmena_u_toku=false;

  });
  }
  proveri_tip_podataka(id:number){
     if(this.koloneIzbora[id].tip_org=='Numerička')
      return true;
    return false;

  }
  prelazakNaStranu(broj:any){
    if(!isNaN(Number(broj)) && Number(broj)>=1 && Number(broj)<=this.brojPodataka){
      this.pageNumber=Number(broj);
      this.prikaziTabelu();
      this.alert_bad=false;
    }
    else{
      this.alert_bad=true;
      this.message=" Morate ukucati broj koji se nalazi izmedju brojeva 1 i "+this.brojPodataka+"!";
    }
  }
  brisanjeIzmena(){
    this.pageNumber=0;
    this.updatedArray=[];
    this.Next();
    this.izmena_u_toku=false;
  }
  SacuvajSve(){
    let input=[];
    let output=[];
    let elem;
    this.normalize=[];
    this.standardize=[];
    this.minmax=[];
    this.enkodiranjeKoloneLabel=[];
    this.enkodiranjeKoloneOne=[];
    for(let i=0;i<this.koloneIzbora.length;i++){
      elem=this.koloneIzbora[i];
      if(elem.ulaz_izlaz!="Ignoriši kolonu"){
        
        if(elem.ulaz_izlaz=="ulaz")
          input.push(elem.name);
        else
          output.push(elem.name);
        if(elem.tip=="Kategorijska" && elem.enkodiranje!="Nije odabrano"){
          if(elem.enkodiranje=="Label encoding")
            this.enkodiranjeKoloneLabel.push(elem.name);
          else
            this.enkodiranjeKoloneOne.push(elem.name);
        }
        if(elem.skaliranje!="Kategorijska" && elem.skaliranje!="Nije odabrano"){
          if(elem.skaliranje=="Normalize")
            this.normalize.push(elem.name);
          else if(elem.skaliranje=="Standardize")
            this.standardize.push(elem.name)
          else 
            this.minmax.push(elem.name);
        }
    }
   }
   if(input.length >0 && output.length > 0)
    {
      this.alert_in_out=false;
      console.log(input);
      console.log(output)
      this.odredi_input_output(input,output);
    }
    else {
      this.alert_in_out=true;
    }
   
  }
   
}
export class mat{
  i:number;
  j:number;
  constructor()
  {
    this.i=0;
    this.j=0;
  }
}
export class KoloneIzbor{
 
  id:number;
  name:string;
  //odabrano:boolean;
  tip:string;
  ulaz_izlaz:string;
  enkodiranje:string;
  skaliranje:string;
  tip_org:string;
  tip_not:boolean;
  constructor(){
    this.id=-1;
    this.name="";
    //this.odabrano=true;
    this.tip="karakter";
    this.ulaz_izlaz="ulaz";
    this.enkodiranje="Nije odabrano";
    this.skaliranje="Nije odabrano";
    this.tip_org="";
    this.tip_not=false;
  }
}
