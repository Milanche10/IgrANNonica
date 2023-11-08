import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public service: UserService) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") == null)
    {
      this.service.createSesion().subscribe(response => {
        let token = (<any>response).Token;
        let username = (<any>response).Username;
        localStorage.setItem("token", token);
        localStorage.setItem("guest", "true")
      });
    }
  }
}