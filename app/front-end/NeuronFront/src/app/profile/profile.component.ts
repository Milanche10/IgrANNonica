import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ModelsComponent } from 'app/models/models.component';
import { UserService } from 'app/shared/user.service';
import * as jQuery from 'jquery';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public display = true ; 
  public page:number = 1; 
  public experimentName?: String; 
  constructor(public router:Router, public service: UserService) { }
  ngOnInit(): void {
  }
}