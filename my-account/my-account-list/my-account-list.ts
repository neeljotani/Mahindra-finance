import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../../app/globalvars';
import { User } from '../../../app/user';
import { SegmentPage } from '../../segment/segment';
import { FixedDepositPage } from '../../fixed-deposit/fixed-deposit';
import { AccountDetailsPage } from '../account-details/account-details';

@Component({
	selector: 'page-my-account-list',
	templateUrl: 'my-account-list.html',
})
export class MyAccountListPage {
	fdAccountList : any;
	loanAccountList : any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	showCofirm() {
		GlobalVars.showAlert("Out Standing EMI Amount","*Outstanding EMI Amount - Doesn’t include the default charge &amp; other charges. Please contact our branch for complete details.");
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MyAccountListPage');
		let extraDetails = User.getLoggedInUser().getExtraDetails();
		console.log("Extra Details : ",extraDetails);
		if(typeof extraDetails != 'undefined' && typeof extraDetails.fdAccountDetails != 'undefined')
			this.fdAccountList = extraDetails.fdAccountDetails;
		if(typeof extraDetails != 'undefined' && typeof extraDetails.vehicalAccountDetails != 'undefined')
			this.loanAccountList = extraDetails.vehicalAccountDetails;
		console.log("FD List : " , this.fdAccountList);
		console.log("Loan List : " , this.loanAccountList);
	}
	gotoDetailsPage( account : any) {
		GlobalVars.printLog(MyAccountListPage.name,"selected account : ",account);
		this.navCtrl.push(SegmentPage, {'accountData' : account}, GlobalVars.navPushOptions);
	}
	gotoFDPage(account : any){
		GlobalVars.printLog(MyAccountListPage.name,"selected account : ",account);
		this.navCtrl.push(FixedDepositPage, {'accountData' : account}, GlobalVars.navPushOptions);
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(AccountDetailsPage.name);
	}

}
