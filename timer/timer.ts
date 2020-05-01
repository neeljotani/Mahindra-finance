import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import {  Subject, Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

@Injectable()
export class Timer{
  private internalTimer: Subject<MinSec>;
  private intervalId: any;
  public minutes: number = 4;
  public seconds: number = 59;
  constructor(public nativeStorage: NativeStorage, public platform: Platform) {
    platform.pause.asObservable().subscribe(() => {
      nativeStorage.setItem("MahindraOTPTimer", { minutes: this.minutes, seconds: this.seconds });
    });
    platform.resume.asObservable().subscribe(() => {
      this.OTPTimerResume();
    });
  }

  startTimer(fromForm: boolean = false,minutes : number = 4, seconds : number = 59): Observable<MinSec> {
    this.minutes = minutes;
    this.seconds = seconds;
    this.stopTimer();
    this.internalTimer = new Subject<MinSec>();
    setTimeout( () => {
      this.timer();
    },1 );
    return this.internalTimer.asObservable();
  }

  private pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
  }

  private timer() {
    this.internalTimer.next({ minutes: this.minutes, seconds: this.pad(this.seconds) });
    this.intervalId = setInterval(() => {
      if (this.seconds != 0 && this.minutes >= 0) {
        this.seconds -= 1;
        this.seconds = this.seconds;
      } else if (this.seconds == 0 && this.minutes > 0) {
        this.minutes -= 1;
        this.seconds = 59;
        this.seconds = this.seconds;
      } else if (this.seconds != 0 && this.minutes == 0) {
        this.seconds -= 1;
        this.seconds = this.seconds;
      } else {
        this.stopTimer();
      }
      this.internalTimer.next({ minutes: this.minutes, seconds: this.pad(this.seconds) });
    }, 1000);
    
  }

  public stopTimer() {
    clearInterval(this.intervalId);
    if(this.internalTimer){
      this.internalTimer.complete();
    }
  }

  private OTPTimerResume() {
    
      Promise.all([this.nativeStorage.getItem("MahindraOTPTimer"), this.nativeStorage.getItem("Mahindra_sessionTimeout")]).then((data) => {
        let pauseTimer = data[0];
        let pauseTime = data[1];
        let newTime = new Date().getTime();
        newTime = newTime - pauseTime;
        let currentMinutes = Math.floor((newTime / 1000) / 60);
        let currentSeconds = Math.floor((newTime / 1000) % 60);
        let pauseMinutes = pauseTimer.minutes;
        let pauseSeconds = pauseTimer.seconds;
        let minutes = 0;
        let seconds = 0;
        let pause = (parseInt(pauseMinutes.toString())*60 + parseInt(pauseSeconds.toString()));
        let current = (parseInt(currentMinutes.toString()) *60 + parseInt(currentSeconds.toString()));
        if(pause > current){
          let newTimer = pause - current;
          minutes = Math.floor(newTimer / 60);
          seconds = newTimer % 60;
        }
        this.minutes = minutes;
        this.seconds = seconds;       
        if(this.internalTimer){
          this.internalTimer.next({minutes : this.minutes, seconds : this.pad(this.seconds)});
        }
    });
  }

}

class MinSec {
  minutes: number;
  seconds: number;
}

