import { Component, ElementRef, Renderer } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { GlobalService } from '../../app/globalService';
import { GlobalVars } from '../../app/globalvars';
import { User } from '../../app/user';
import { IonicUtil } from '../../providers/ionic-util';
import { JSONStoreService } from '../../app/jsonStoreService';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  	pin : string;
	confirmPin : string;
	hideCurrentPin = true;
	hideNewPin = true;
  	hideConfirmPin = true;
	oldPin : string;
	newPin : string;
	confirmNewPin : string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public elementRef: ElementRef, public renderer: Renderer,public appCtrl : App,public ionicUtil : IonicUtil) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  	showCurrentPin() {
		this.hideCurrentPin = !this.hideCurrentPin;
	}
	showNewPin() {
		this.hideNewPin = !this.hideNewPin;
	}
	showConfirmPin(){
		this.hideConfirmPin = !this.hideConfirmPin;
	}
	continue(){

	}
  
  	onKeyPressed(event,id){
		let self = this;
		this.ionicUtil.onPinChange(self, event, id);
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(ResetPasswordPage.name);
	}
	clearPassword(event: any){
		this.ionicUtil.clearInputField(event);	
	}
	changePin(){
		let requestParams = {};
		let whereParams = {};
		requestParams[GlobalVars.databaseTables.USER_DETAIL.PIN] =GlobalVars.encryptPin(this.newPin);
		whereParams[GlobalVars.databaseTables.USER_DETAIL.ID] = User.getLoggedInUser().getUserId();
		let parameter ={
			userId : User.getLoggedInUser().getUserId(),
			oldPin : GlobalVars.encryptPin(this.oldPin),
			newPin : GlobalVars.encryptPin(this.newPin),
			whereParams : JSON.stringify(whereParams),
			requestParams : JSON.stringify(requestParams)
		}
		if( this.oldPin == this.newPin )
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.NEW_OLD_PIN_SAME);
		else if( this.newPin != this.confirmNewPin )
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.NEW_CONFIRM_PIN_NOT_MATCH);
		else{	
			GlobalService.checkPin(parameter).then((response) => {
				if(response.responseJSON.status == 400){
					GlobalVars.printLog(ResetPasswordPage.name,"CHECK PIN STATUS :",JSON.stringify(response));	
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.INCORRECT_PIN);				

				}
				else if(response.responseJSON.status == 200){
					JSONStoreService.updateUserDetail(JSONStoreService.collectionName,User.getLoggedInUser().getUserId(),"pin",GlobalVars.encryptPin(this.newPin));
					let buttons = [{
						text: GlobalVars.translateText('Close'),
						handler: () => {
							this.appCtrl.getActiveNavs()[0].pop();
						}
					}];
					GlobalVars.showAlert(GlobalVars.successMessageTitle,GlobalVars.successMessages.PIN_CHANGED,buttons);
					

				}else{
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
				}

			}).catch((err) => {
					GlobalVars.printLog(ResetPasswordPage.name,"CHECK PIN ERROR :",JSON.stringify(err));
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
			});

		}
		
	}
}
