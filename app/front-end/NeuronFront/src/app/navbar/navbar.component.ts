import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../shared/user.service';
import { LoadingScreenServiceService } from '../loadingScreen/loading-screen-service.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username = localStorage.getItem('username'); 
  constructor(public service: UserService, public loadingScreenService: LoadingScreenServiceService, private router:Router,) { }

  ngOnInit(): void {
  }
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  goTo(){
    sessionStorage.clear();
    this.router.navigate([`/`]).then(
      ()=>{}
    );
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
      let element = document.querySelector('.navbar') as HTMLElement;
      if (window.pageYOffset > element.clientHeight) {
        element.classList.add('navbar-inverse');
      } else {
        element.classList.remove('navbar-inverse');
      }
    }
}
