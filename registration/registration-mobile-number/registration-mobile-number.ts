import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OtpVerificationPage } from '../otp-verification/otp-verification';
import { GlobalService } from '../../../app/globalService';
import { GlobalVars } from '../../../app/globalvars';
import { Commons } from '../../../app/framework';
import { AndroidPermissions } from '@ionic-native/android-permissions';


@Component({
	selector: 'page-registration-mobile-number',
	templateUrl: 'registration-mobile-number.html',
})
export class RegistrationMobileNumberPage {
	mobileNo: string; 
	authenticationData : any;
	ionicUtil: any;
	constructor(public navCtrl: NavController, public navParams: NavParams,private androidPermissions: AndroidPermissions) {
		
	}

	ionViewDidLoad(){
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then((result)=>{
			GlobalVars.printLog(RegistrationMobileNumberPage.name,'Has permission?',result.hasPermission)
			if(!result.hasPermission){
				this.androidPermissions.requestPermissions([
					this.androidPermissions.PERMISSION.RECEIVE_SMS,
					this.androidPermissions.PERMISSION.READ_SMS
				]);
			}
		},(err)=>{
			this.androidPermissions.requestPermissions([
				this.androidPermissions.PERMISSION.RECEIVE_SMS,
				this.androidPermissions.PERMISSION.READ_SMS
			]);
		});
	}
	clearPassword(event: any){
		this.ionicUtil.clearInputField(event);	
	}
	otpVerifPage() {
		if (typeof this.mobileNo != "undefined" && this.mobileNo.length == 10) {
			Commons.showLoadingMask("Validating number, Kindly wait.");
			GlobalService.getUser(this.mobileNo).then((result) => {
				GlobalVars.printLog(RegistrationMobileNumberPage.name,"Getuser response : ", result);
				// status failed means no user found for given mobile no hence allow to register
				// also allow the user who has not completed entire registration flow
				if((result.status == 200 && result.responseJSON.status == "failed") || (result.status == 200 && typeof result.responseJSON.data != 'undefined'  && result.responseJSON.data.is_registered == "0")){
					GlobalService.authentication(this.mobileNo).then((res)=>{
						GlobalVars.printLog(RegistrationMobileNumberPage.name,"Authentication sucess : ", res);
						if(res.status == 200){
							if(res.responseJSON.StatusCode == 200){
								Commons.hideLoadingMask();
								this.authenticationData = res.responseJSON.data;
								this.navCtrl.push(OtpVerificationPage,{"mobileNo":this.mobileNo, "authenticationData" : this.authenticationData},GlobalVars.navPushOptions);
							}else{
								Commons.hideLoadingMask();
								GlobalVars.showAlert(GlobalVars.errorMessageTitle,res.responseJSON.Message);
							}
						}else{
							Commons.hideLoadingMask();
							GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
						}
					},(err)=>{
						GlobalVars.printLog(RegistrationMobileNumberPage.name,"Authentication error : ", err);
						Commons.hideLoadingMask();
						GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
					});
				}
				// not allowed to re-register
				else{
					Commons.hideLoadingMask();
					GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.informationMessages.ALREADY_REGISTERED);
					this.navCtrl.pop(GlobalVars.navPushOptions);
				}
			},(err)=>{
				Commons.hideLoadingMask();
				GlobalVars.printLog(RegistrationMobileNumberPage.name,"Getuser error : ", err);
				GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
			});
			//this.navCtrl.push(OtpVerificationPage,{"mobileNo":this.mobileNo});
		} else {
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.INVALID_REGISTRATION_MOBILE_NO);
		}
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(RegistrationMobileNumberPage.name);
	}

}
