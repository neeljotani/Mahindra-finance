import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../../../app/user';
import { OffersDetailsPage } from '../offers-details/offers-details';
import { GlobalVars } from '../../../app/globalvars';

@Component({
	selector: 'page-pre-approved-loan-offer',
	templateUrl: 'pre-approved-loan-offer.html',
})
export class PreApprovedLoanOfferPage {

	preApprovedLoanDetails : any;
	noOffers : boolean = true;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.preApprovedLoanDetails = User.getLoggedInUser().getExtraDetails().preApprovedLoanDetails;
		console.log("preApprovedLoanDetails : ", this.preApprovedLoanDetails);
		if(typeof this.preApprovedLoanDetails != 'undefined' && this.preApprovedLoanDetails != null && this.preApprovedLoanDetails.length != 0){
			this.noOffers = false;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PreApprovedLoanOfferPage');
	}
	gotopage(){
		this.navCtrl.push(OffersDetailsPage,{'offerDetails' : this.preApprovedLoanDetails},GlobalVars.navPushOptions);
	}
	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(PreApprovedLoanOfferPage.name);
	}
}
