import { Component } from '@angular/core';
import { Weather } from '../models/Weather';
import { HomeService } from './home-service/home.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  model = new Weather(24,'0001-01-01T00:00:00', '');

  constructor(private homeService: HomeService) {

  }
  
  submitted = false;

  onSubmit() {
    this.submitted = true;
    console.log(<Weather>{ TemperatureC: this.model.TemperatureC, Date: this.model.Date, Summary: this.model.Summary });
    this.homeService.saveWeather(<Weather>{ TemperatureC: this.model.TemperatureC, Date: this.model.Date, Summary: this.model.Summary });
  }
}

