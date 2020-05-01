import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PayOnlinePaymentModePage } from '../pay-online-payment-mode/pay-online-payment-mode';
import { GlobalVars } from '../../../app/globalvars';

@Component({
  selector: 'page-pay-online-confirm-detail',
  templateUrl: 'pay-online-confirm-detail.html',
})
export class PayOnlineConfirmDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  choosPaymentModePage(){
    this.navCtrl.push(PayOnlinePaymentModePage);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PayOnlineConfirmDetailPage');
  }
  ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(PayOnlineConfirmDetailPage.name);
	}

}
