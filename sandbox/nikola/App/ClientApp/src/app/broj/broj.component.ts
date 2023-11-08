import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-broj',
  templateUrl: './broj.component.html'
})
export class BrojComponent {
  brojs: Broj[] = [];
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    http.get<Broj[]>(baseUrl + 'api/broj').subscribe(result => {
      this.brojs = result;
    }, error => console.error(error));
  }
  sum(broj1: string, broj2: string) {
    this.http.post<Broj>(this.baseUrl + 'api/broj', <Broj>{ Rezultat: parseFloat(broj1) + parseFloat(broj2) }).subscribe(result => {
    }, error => console.error(error));
    this.http.get<Broj[]>(this.baseUrl + 'api/broj').subscribe(result => {
      this.brojs = result;
    }, error => console.error(error));
  }
}
interface Broj {
  Rezultat: number
}
