import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenServiceService {

  public isLoading: boolean = false;
  public showNotification: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isSuccess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public errorText!: string;

  timeLeft: number = 3;
  interval : any;
  subscribeTimer: any;

  constructor() { }

  oberserableTimer() {
    const source = timer(1000, 2000).subscribe(val => {
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.pauseTimer()
      }
    }, 1000)
  }

  pauseTimer() {
    this.timeLeft = 3;
    this.showNotification.next(false);
    clearInterval(this.interval);
  }
}
