import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../app/user';
import { GlobalVars } from '../../app/globalvars';

@Component({
	selector: 'page-call-executive',
	templateUrl: 'call-executive.html',
})
export class CallExecutivePage {

	executiveDetails : any;
	vehicalAccountDetails : any;
	showDetails : boolean = true;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CallExecutivePage');
	}
	
	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(CallExecutivePage.name);
		this.executiveDetails = User.getLoggedInUser().getExtraDetails().excutiveDetails;
		this.vehicalAccountDetails = User.getLoggedInUser().getExtraDetails().vehicalAccountDetails;
		if(typeof this.executiveDetails != 'undefined' && this.executiveDetails.length != 0){
			this.showDetails = true;
			this.executiveDetails.forEach(element => {
				let filterdAccount = this.vehicalAccountDetails.filter(item => item["account_number"] == element.account_number)[0];
				element["vehicle_model_name"] = filterdAccount.vehicle_model_name;
				element["vehicle_registration_no"] = filterdAccount.vehicle_registration_no;		
			});
		}
			
		else
			this.showDetails = false;
	}
}