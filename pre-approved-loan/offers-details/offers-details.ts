import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalService } from '../../../app/globalService';
import { GlobalVars } from '../../../app/globalvars';
import { Commons } from '../../../app/framework';
import { TermsAndConditionsPage } from '../../terms-and-conditions/terms-and-conditions';

@Component({
	selector: 'page-offers-details',
	templateUrl: 'offers-details.html',
})
export class OffersDetailsPage {

	step = "10000";
	offerDetails = [];
	filterDetails = [];
	min;
	max;
	selectedLoanAmount;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		this.offerDetails = this.navParams.get('offerDetails');
		this.min = this.getMin(this.offerDetails,"Loan_Amount");
		this.max = this.getMax(this.offerDetails,"Loan_Amount"); 
		this.selectedLoanAmount = this.min;
		console.log("Minimum value : ",this.min);
		console.log("Maximum value : ",this.max);
	}
	ionViewDidEnter() {
		console.log('ionViewDidLoad OffersDetailsPage');
		let rangeTick = document.getElementsByClassName('range-tick');
		GlobalVars.googleAnalyticsTrackView(OffersDetailsPage.name);
		//console.log('rangeTick ', rangeTick);

		for (let i = 0; i < rangeTick.length; i++) {
			//console.log(rangeTick[i]);
			if(i == 0){
				rangeTick[i].innerHTML = `<span class="progRaange-value">`+ this.min.toString().slice(0,2) +`<br> Min</span>`;
			}else if( i == rangeTick.length-1 ){
				rangeTick[i].innerHTML = `<span class="progRaange-value">`+this.max.toString().slice(0,2) +`<br> Max</span>`;
			}else {
				var value = parseInt(this.min) + (parseInt(this.step) * i);
				console.log("value : ",value);
				rangeTick[i].innerHTML = `<span class="progRaange-value">`+value.toString().slice(0,2) +`</span>`;
			}
		}

	}

	getMax(arr, prop) {
		var max;
		for (var i=0 ; i<arr.length ; i++) {
			if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
				max = arr[i];
		}
		return max[prop];
	}

	getMin(arr, prop) {
		var min;
		for (var i=0 ; i<arr.length ; i++) {
			if (!min || parseInt(arr[i][prop]) < parseInt(min[prop]))
				min = arr[i];
		}
		this.filterDetails = min;
		return min[prop];
	}

	checkValue(){
		//console.log("value : ",this.selectedLoanAmount);
		this.filterDetails = this.offerDetails.filter(item => item["Loan_Amount"] == this.selectedLoanAmount.toString())[0];
		console.log("offer details : ",this.filterDetails);
	}
	applyNow(){
		Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
		let params = {
			"Enquiry": {
				"ContractOfferid": this.filterDetails["Contract_OfferID"],
				"OfferAccepted": "2",
				"HpaNo": this.filterDetails["NEW_HPANO"],
				"LoanAmount": this.filterDetails["Loan_Amount"],
				"Tenure": this.filterDetails["Tenure"]
			}
		}
		
		GlobalService.acceptOfferDetails(params).then((res)=>{
			if(res.responseJSON.OffersDBResponse.Status == "SUCCESS"){
				let buttons = [{
					text: GlobalVars.translateText('Ok'),
					handler: () => {
						this.navCtrl.popToRoot();
					}
				}];
				Commons.hideLoadingMask();
				GlobalVars.showAlert(GlobalVars.successMessageTitle,GlobalVars.successMessages.OFFER_ACCEPTED,buttons);
			}else{
				Commons.hideLoadingMask();
				GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
			}
		},(err)=>{
			Commons.hideLoadingMask();
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
		});
	}
	goToTerms(){
		this.navCtrl.push(TermsAndConditionsPage);
	}
}
