import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';
import { Commons } from '../../app/framework';
import { GlobalService } from '../../app/globalService';
import { NativeStorage } from '@ionic-native/native-storage';
import { UserBean, User } from '../../app/user';
import { DashboardTabPage } from '../dashboard/dashboard-tab/dashboard-tab';
import { UserLogin } from '../../app/mobilefirst/UserLogin';
import { MyApp } from '../../app/app.component';
import { ForgotPinPage } from '../forgot-pin/forgot-pin';
import { JSONStoreService } from '../../app/jsonStoreService';
import { IonicUtil } from '../../providers/ionic-util';
import { BranchLocatorPage } from '../branch-locator/branch-locator';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	mobileNo: string;
	pin: string;
	userLogin: UserLogin;
	cachedUserDetails: any;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public nativeStorage: NativeStorage,
		public elementRef: ElementRef,
		public renderer: Renderer,
		public ionicUtil: IonicUtil
	) {
		console.log("in constructor");
	}
	
	goToBranch(){
		this.navCtrl.push(BranchLocatorPage);
	}

	
	forgtPinPage() {
		this.navCtrl.push(ForgotPinPage);
	}

	onPinChange(event: any) {

		let self = this;
		this.ionicUtil.onPinChange(self, event, "#btnLogin");

	}

	clearPassword(event: any) {
		this.ionicUtil.clearInputField(event);
	}

	ionViewDidLoad() {
		GlobalVars.lastLoginId = "";
		this.userLogin = MyApp.challengeHandler;
		JSONStoreService.getDataFromJSON(JSONStoreService.collectionName).then((data) => {
			this.cachedUserDetails = data;
			this.mobileNo = this.cachedUserDetails.id;
		});
	}

	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(LoginPage.name);
	}

	login() {
		if (typeof this.mobileNo != 'undefined' && this.mobileNo.length == 10) {
			if (typeof this.pin != 'undefined' && this.pin.length == 4) {
				Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
				if (GlobalVars.lastLoginId == "")
					GlobalVars.lastLoginId = this.mobileNo;
				if (GlobalVars.isOnline)
					GlobalService.login(this.userLogin, this.mobileNo, this.pin, this.navCtrl, this.nativeStorage).then(() => {
						GlobalService.getUserAllData(this.mobileNo).then((res) => {
							console.log("data from getUserAllData", res);
							if (res.responseJSON.status == 200) {
								JSONStoreService.updateJSONdetails(JSONStoreService.collectionName, this.mobileNo, res.responseJSON.data);
								User.getLoggedInUser().setExtraDetails(res.responseJSON.data);
								this.navCtrl.setRoot(DashboardTabPage, {}, GlobalVars.navPushOptions);

							} else {
								GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
							}
						});
					}, (err) => {
						this.pin = "";
					});
				else {
					if (typeof this.cachedUserDetails != 'undefined' && typeof this.cachedUserDetails.id != 'undefined' && typeof this.cachedUserDetails.pin != 'undefined') {
						if (this.cachedUserDetails.id == this.mobileNo && GlobalVars.encryptPin(this.pin) == this.cachedUserDetails.pin) {
							if (!this.cachedUserDetails.isLocked) {
								//this.nativeStorage.getItem("extraDetails").then((res)=>{
								Commons.hideLoadingMask();
								let userInfo: UserBean = new UserBean();
								userInfo.setUserId(this.cachedUserDetails.id);
								userInfo.setLastLoginDate(this.cachedUserDetails.lastLoginDate);
								userInfo.setExtraDetails(this.cachedUserDetails.extraDetails);
								userInfo.setIsOnlineLogin(false);
								userInfo.setIsLocked(this.cachedUserDetails.isLocked);
								User.setLoggedInUser(userInfo);
								GlobalVars.loginCount = 0;
								this.navCtrl.setRoot(DashboardTabPage, {}, GlobalVars.navPushOptions);
								/* },(err)=>{
									Commons.hideLoadingMask();
									GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.NO_DATA_FOUND_ON_CACHE);
								}); */
							} else {
								Commons.hideLoadingMask();
								GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.APP_LOCK_OFFLINE);
							}

						} else {
							Commons.hideLoadingMask();
							GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_CREDENTIALS);
						}
					} else {
						Commons.hideLoadingMask();
						GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.NO_DATA_FOUND_ON_CACHE);
					}
				}
			} else {
				GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_LOGIN_PIN);
			}
		} else {
			GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_LOGIN_MOBILE_NO);
		}
	}
}
