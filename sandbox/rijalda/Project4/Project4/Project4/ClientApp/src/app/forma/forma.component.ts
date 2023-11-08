import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router, RouterLink } from '@angular/router';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'forma',
  templateUrl: './forma.component.html',
  styleUrls: ['./forma.component.css']
})
export class FormaComponent {
  alert: boolean = false;
  
    id: any;
    ime: any;
    prezime: any;
    zanimanje: any;
    kompanija: any;
 


  constructor(public http: HttpClient, @Inject('BASE_URL') public baseUrl: string, private route: Router) {
   
  }

  onSubmit() {
    
    this.alert = true;

    return this.http.post<string>(this.baseUrl + 'api/Zaposleni', { "id": this.id, "ime": this.ime, "prezime": this.prezime, "kompanija": this.kompanija, "zanimanje": this.zanimanje }).subscribe(result => {
      console.log(result);
      this.route.navigateByUrl('');
    }, error => { console.log(error) });
    
  }
  
  
}
interface Zaposleni {
  id: number;
  ime: string;
  prezime: string;
  zanimanje: string;
  kompanija: string;
}

