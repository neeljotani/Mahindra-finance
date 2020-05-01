import { Component, ViewChild } from '@angular/core';
import { NavController, PopoverController, App, Tabs } from 'ionic-angular';
import { DashboardPage } from '../dashboard';
import { MyAccountListPage } from '../../my-account/my-account-list/my-account-list';
import { MenuPage } from '../../menu/menu';
import { GlobalVars } from '../../../app/globalvars';
import { User } from '../../../app/user';
import { LanguageScreenPage } from '../../language-screen/language-screen';
import { TermsAndConditionsPage } from '../../terms-and-conditions/terms-and-conditions';
import { PrivacyPolicyPage } from '../../privacy-policy/privacy-policy';
import { ResetPasswordPage } from '../../reset-password/reset-password';
import { ContactUsPage } from '../../contact-us/contact-us';

@Component({
	selector: 'page-dashboard-tab',
	templateUrl: 'dashboard-tab.html'
})
export class DashboardTabPage {

	@ViewChild('myTabs') tabRef : Tabs;
	homeTab = DashboardPage;
	myAccountTab = MyAccountListPage;
	showOfflineInfo: boolean = false;
	lastLoginDate : string = "";

	constructor(public appCtrl : App,public navCtrl: NavController, public popoverCtrl: PopoverController) {

	}
	presentPopover(myEvent) {
		let popover = this.popoverCtrl.create(MenuPage);
		popover.present({
			ev: myEvent
		});

		popover.onDidDismiss(data => {
			console.log("Data : ",data);
			if(data == 1){
				this.tabRef.getSelected().goToRoot({}).then(()=>{
					this.tabRef.select(0);
				});
				//this.appCtrl.getActiveNavs()[0].getActive().dismiss();
				//this.navCtrl.popToRoot(GlobalVars.navPopOptions);
			}
			else if(data == 2){
				this.appCtrl.getActiveNavs()[0].push(LanguageScreenPage,{"fromMenuBar":true},GlobalVars.navPushOptions);
				//this.navCtrl.push(LanguageScreenPage,{"fromMenuBar":true},GlobalVars.navPushOptions);
			}
			else if(data == 3){
				this.appCtrl.getActiveNavs()[0].push(ResetPasswordPage,{},GlobalVars.navPushOptions);
				//this.navCtrl.push(LanguageScreenPage,{"fromMenuBar":true},GlobalVars.navPushOptions);
			}
			else if(data == 4){
				this.appCtrl.getActiveNavs()[0].push(TermsAndConditionsPage,{},GlobalVars.navPushOptions);
				//this.navCtrl.push(LanguageScreenPage,{"fromMenuBar":true},GlobalVars.navPushOptions);
			}
			else if(data == 5){
				this.appCtrl.getActiveNavs()[0].push(PrivacyPolicyPage,{},GlobalVars.navPushOptions);
				//this.navCtrl.push(LanguageScreenPage,{"fromMenuBar":true},GlobalVars.navPushOptions);
			}
			else if(data == 6){
				this.appCtrl.getActiveNavs()[0].push(ContactUsPage,{},GlobalVars.navPushOptions);
				//this.navCtrl.push(LanguageScreenPage,{"fromMenuBar":true},GlobalVars.navPushOptions);
			}
		})
	}
	presentOfflineInfo() {
		this.showOfflineInfo = true;
		/* setTimeout(()=>{
			this.showOfflineInfo = false;
		},3000); */
		
	}

	isOffline(){
		return !GlobalVars.isOnline;
	}

	ionViewDidLoad(){
		console.log("in ionViewDidLoad");
		this.lastLoginDate = User.getLoggedInUser().getLastLoginDate();
	}
}
