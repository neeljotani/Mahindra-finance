import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';
import { GlobalService } from '../../app/globalService';
import { Commons } from '../../app/framework';
import { OtpVerificationPage } from '../registration/otp-verification/otp-verification';

@Component({
	selector: 'page-forgot-pin',
	templateUrl: 'forgot-pin.html',
})
export class ForgotPinPage {
	ionicUtil: any;

	mobileNo: string;
	authenticationData: any;

	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ForgotPinPage');
	}

	otpVerifPage() {
		if (typeof this.mobileNo != "undefined" && this.mobileNo.length == 10) {
			Commons.showLoadingMask("Validating number, Kindly wait.");
			GlobalService.getUser(this.mobileNo).then((result) => {
				GlobalVars.printLog(ForgotPinPage.name, "Getuser response : ", result);
				// status failed means no user found for given mobile no hence allow to register
				// also allow the user who has not completed entire registration flow
				if ((result.status == 200 && result.responseJSON.status == "failed") || (result.status == 200 && typeof result.responseJSON.data != 'undefined' && result.responseJSON.data.is_registered == "1")) {
					GlobalService.authentication(this.mobileNo).then((res) => {
						GlobalVars.printLog(ForgotPinPage.name, "Authentication sucess : ", res);
						if (res.status == 200) {
							if (res.responseJSON.StatusCode == 200) {
								Commons.hideLoadingMask();
								this.authenticationData = res.responseJSON.data;
								this.navCtrl.push(OtpVerificationPage, { "mobileNo": this.mobileNo, "authenticationData": this.authenticationData, "redirectionFrom": ForgotPinPage.name }, GlobalVars.navPushOptions);
							} else {
								Commons.hideLoadingMask();
								GlobalVars.showAlert(GlobalVars.errorMessageTitle, res.responseJSON.Message);
							}
						} else {
							Commons.hideLoadingMask();
							GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
						}
					}, (err) => {
						GlobalVars.printLog(ForgotPinPage.name, "Authentication error : ", err);
						Commons.hideLoadingMask();
						GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
					});
				}
				// not allowed to re-register
				else {
					Commons.hideLoadingMask();
					GlobalVars.showAlert(GlobalVars.informationMessageTitle, GlobalVars.informationMessages.NOT_REGISTERED);
					this.navCtrl.pop(GlobalVars.navPushOptions);
				}
			}, (err) => {
				Commons.hideLoadingMask();
				GlobalVars.printLog(ForgotPinPage.name, "Getuser error : ", err);
				GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
			});
			//this.navCtrl.push(OtpVerificationPage,{"mobileNo":this.mobileNo});
		} else {
			GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_REGISTRATION_MOBILE_NO);
		}
	}

	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(ForgotPinPage.name);
	}

}
