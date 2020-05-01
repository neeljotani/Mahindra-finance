import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';

@Component({
	selector: 'page-fixed-deposit',
	templateUrl: 'fixed-deposit.html',
})
export class FixedDepositPage {
	accountData : any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.accountData = this.navParams.get('accountData');
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad FixedDepositPage');
	}
	
	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(FixedDepositPage.name);
	}



}
