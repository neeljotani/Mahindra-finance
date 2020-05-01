import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PayOnlineConfirmDetailPage } from '../pay-online-confirm-detail/pay-online-confirm-detail';
import { GlobalVars } from '../../../app/globalvars';

@Component({
  selector: 'page-pay-online-detail',
  templateUrl: 'pay-online-detail.html',
})
export class PayOnlineDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayOnlineDetailPage');
  }

  payConfirmDetPage(){
    this.navCtrl.push(PayOnlineConfirmDetailPage);
  }
  ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(PayOnlineDetailPage.name);
	}

}
