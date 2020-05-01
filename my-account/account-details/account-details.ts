import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { GlobalVars } from '../../../app/globalvars';

@Component({
	selector: 'page-account-details',
	templateUrl: 'account-details.html',
})
export class AccountDetailsPage {

	shownGroup = null;

	hideMe: boolean;
	index: number;

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
	}

	showCofirm() {
		const confirm = this.alertCtrl.create({
			title: "Out Standing EMI Amount",
			message: "*Outstanding EMI Amount - Doesn’t include the default charge &amp; other charges. Please contact our branch for complete details."
		});
		confirm.present()
	}

	/*   toggleGroup(group) {
		console.log("AAA")
		if (this.isGroupShown(group)) {
			this.shownGroup = null;
		} else {
			this.shownGroup = group;
		}
	};
	isGroupShown(group) {
	  return this.shownGroup === group;
	}; */

	toggleGroup(index) {

		console.log("index : " + index);
		this.index = index;

		/*  if(this.hideMe){
		   this.hideMe = false;
		 } else {
		   this.hideMe = true;
		 } */
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad AccountDetailsPage');
		GlobalVars.printLog(AccountDetailsPage.name,"Accound Data : ",this.navParams.data);
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(AccountDetailsPage.name);
	}
}
