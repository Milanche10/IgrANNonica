import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Weather } from 'src/app/models/Weather';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    
  }

  public saveWeather(request: Weather) {
    this.http.post<Weather>(this.baseUrl + 'weatherforecast', request).subscribe(result => {
      console.log(result);
    }, error => console.error(error));
  }

}
