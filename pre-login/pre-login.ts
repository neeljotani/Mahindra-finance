import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RegistrationMobileNumberPage } from '../registration/registration-mobile-number/registration-mobile-number';
import { LoginPage } from '../login/login';
import { GlobalVars } from '../../app/globalvars';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';

@Component({
	selector: 'page-pre-login',
	templateUrl: 'pre-login.html',
})
export class PreLoginPage {

	constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation,public nativeGeocoder: NativeGeocoder) {
	}
	enterRegNumber() {
		if(GlobalVars.isOnline){
			this.navCtrl.push(RegistrationMobileNumberPage,{},GlobalVars.navPushOptions);
		}else{
			GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.errorMessages.REGISTRATION_RESTRICTED);
		}
	}
	loginWidthMobilePinPage() {
		this.navCtrl.push(LoginPage,{},GlobalVars.navPushOptions);
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(PreLoginPage.name);
		
	}
	
}
