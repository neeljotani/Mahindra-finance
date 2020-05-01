import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../../app/globalvars';

@Component({
  selector: 'page-repayment-details',
  templateUrl: 'repayment-details.html',
})
export class RepaymentDetailsPage {
  index : number;
  private isReminderBox  = false;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  showCalendar() {
    console.log("calenndar");
    this.isReminderBox = !this.isReminderBox;
  }


  toggleGroup(index){

    console.log("index : " + index);
    this.index = index;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabRepaymentDetailsPage');
  }

  ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(RepaymentDetailsPage.name);
	}

}
