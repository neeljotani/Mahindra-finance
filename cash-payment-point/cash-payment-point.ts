import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';
import { Commons } from '../../app/framework';
import { GlobalService } from '../../app/globalService';

/**
 * Generated class for the CashPaymentPointPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-cash-payment-point',
	templateUrl: 'cash-payment-point.html',
})
export class CashPaymentPointPage {

	pincode: string;
	showDetails: boolean = false;
	cashPaymentPointDetails = [];

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CashPaymentPointPage');
	}
	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(CashPaymentPointPage.name);
	}

	getBranchDetails() {

		if (typeof this.pincode == 'undefined' || this.pincode == "") {
			this.showDetails = false;
			this.pincode = "";
			GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_PINCODE);
		} else {
			if (GlobalVars.isOnline) {
				Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
				this.cashPaymentPointDetails = [];
				GlobalService.getCashPaymentPointDetails(this.pincode).then((res) => {
					Commons.hideLoadingMask();
					console.log("CashPaymentPointDetails response : ", res);
					if (res.responseJSON.StatusCode == 200) {
						if (res.responseJSON.Fino_Payment_Bank_Locations.Status == "SUCCESS") {
							let cashPaymentPointDetail = res.responseJSON.Fino_Payment_Bank_Locations.data;
							cashPaymentPointDetail.forEach(element => {
								let details = {};
								details["bankBranchName"] = element.Bank_Branch_Name;
								details["pincode"] = element.Pin_Code;
								details["branchAddress"] = element.Branch_Address;
								details["city"] = element.City;

								this.cashPaymentPointDetails.push(details);
							});
							this.showDetails = true;
						} else {
							this.showDetails = false;
						}
					} else {
						this.showDetails = false;
						GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.NO_CASH_PAYMENT_POINT_FOUND);
					}
				}, (err) => {
					console.log("Cash Payment Point  err : ", err);
					this.showDetails = false;
					Commons.hideLoadingMask();
					GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
				});
			} else {
				GlobalVars.showAlert(GlobalVars.informationMessageTitle, GlobalVars.errorMessages.OFFLINE_MODE_ERROR);
			}


		}
		
  }
  
  getPincodeViaUserLocation(){
    this.cashPaymentPointDetails = [];
    this.showDetails = false;
    Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
    this.pincode = "";
    if(GlobalVars.isOnline){
			GlobalVars.getUserLocation().then((resp)=>{
        GlobalVars.printLog(CashPaymentPointPage.name,"LOCATION SUCCESS",JSON.stringify(resp));
        GlobalVars.getPinCode(resp.latitude,resp.longitude).then((response) => {
          GlobalVars.printLog(CashPaymentPointPage.name,"GET PIN CODE SUCCESS",JSON.stringify(response));
          this.pincode = response.result.postalCode;
          Commons.hideLoadingMask();
  
        }).catch((err) => {
          GlobalVars.printLog(CashPaymentPointPage.name,"GET PIN CODE ERROR",JSON.stringify(err));
          Commons.hideLoadingMask();
        });
  
      }).catch((err) => {
        GlobalVars.printLog(CashPaymentPointPage.name,"LOCATION ERROR",JSON.stringify(err));
        Commons.hideLoadingMask();
      });
		}else{
      GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.errorMessages.OFFLINE_MODE_ERROR);
      Commons.hideLoadingMask();
		}
    

	}

}
