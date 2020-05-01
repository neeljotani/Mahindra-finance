import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { GlobalVars } from '../../app/globalvars';
import { User } from '../../app/user';
import { PreApprovedLoanOfferPage } from '../pre-approved-loan/pre-approved-loan-offer/pre-approved-loan-offer';
import { CallExecutivePage } from '../call-executive/call-executive';
import { BranchLocatorPage } from '../branch-locator/branch-locator';
import { CashPaymentPointPage } from '../cash-payment-point/cash-payment-point';
import { SegmentPage } from '../segment/segment';

@Component({
	selector: 'page-dashboard',
	templateUrl: 'dashboard.html',
})
export class DashboardPage {
	slides = [];
	showSlides : boolean;
	extraDetails: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public nativeStorage: NativeStorage) {
	}
	ionViewDidEnter() {		
		this.extraDetails = User.getLoggedInUser().getExtraDetails();
		this.showSlides = typeof this.extraDetails != 'undefined' && typeof this.extraDetails.vehicalAccountDetails != 'undefined' && this.extraDetails.vehicalAccountDetails.length != 0;
		GlobalVars.printLog(DashboardPage.name, "Extra Details : ", this.extraDetails);
			GlobalVars.googleAnalyticsTrackView(DashboardPage.name);
		
	}

	openPage(page : string){
		if(page == 'callExecutive')
			this.navCtrl.push(CallExecutivePage);
		else if (page == 'branchLocator')
			this.navCtrl.push(BranchLocatorPage);
		else if(page == 'preApprovedLoan')
			this.navCtrl.push(PreApprovedLoanOfferPage);
		else if(page == 'cashPaymentPoint')
			this.navCtrl.push(CashPaymentPointPage);
	}

	viewLoanDetails(accountData : any){
		this.navCtrl.push(SegmentPage,{"accountData" : accountData});
	}
}
