import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public zaposleni: Zaposleni[]=[];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Zaposleni[]>(baseUrl + 'api/Zaposleni').subscribe(result => {
      this.zaposleni = result;
    }, error => console.error(error));
  }

}
interface Zaposleni {
  id: number;
  ime: string;
  prezime: string;
  zanimanje: string;
  kompanija: string;
}
