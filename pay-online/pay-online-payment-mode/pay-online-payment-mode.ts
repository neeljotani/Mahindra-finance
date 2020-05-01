import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../../app/globalvars';

@Component({
  selector: 'page-pay-online-payment-mode',
  templateUrl: 'pay-online-payment-mode.html',
})
export class PayOnlinePaymentModePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PayOnlinePaymentModePage');
  }
  ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(PayOnlinePaymentModePage.name);
	}
}
