import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { ConstantsService } from 'app/constants/constants.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'NeuronFront';
  id: any;
  private baseUrl:String = ConstantsService.baseURL+'ApplicationUser';

  constructor(private http: HttpClient){ }

  ngOnInit() {
    this.battleInit();
    this.id = setInterval(() => {
      this.battleInit(); 
    }, 30000);
  }

  battleInit(){
    //console.log('Nesto');
    //this.http.get(this.baseUrl+'/getic');
    /*this.http.get(this.baseUrl + '/checkIfExpired').subscribe(result => {
      console.log(result);
    }, error => console.error(error));
    console.log('Pali se funkicja');*/
  }
  
  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }
}

