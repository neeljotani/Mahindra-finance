import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from '@ngx-translate/core';
import { AppIntroductionPage } from '../app-introduction/app-introduction';
import { GlobalVars } from '../../app/globalvars';

@Component({
	selector: 'page-language-screen',
	templateUrl: 'language-screen.html',
})
export class LanguageScreenPage {
	selectedLanguage: string = "en";
	fromMenuBar: boolean = false;
	constructor(public appCtrl : App,public navCtrl: NavController, public nativeStorage: NativeStorage, public translate: TranslateService, public navParams: NavParams) {
	}

	next() {
		if (!this.fromMenuBar) {
			GlobalVars.printLog(LanguageScreenPage.name, "Languae : ", this.selectedLanguage);
			this.nativeStorage.setItem('appLanguage', this.selectedLanguage);
			this.nativeStorage.setItem('alreadyVisited', true);
			this.translate.setDefaultLang(this.selectedLanguage);
			this.navCtrl.push(AppIntroductionPage, {}, GlobalVars.navPushOptions);
		} else {
			GlobalVars.printLog(LanguageScreenPage.name, "Languae : ", this.selectedLanguage);
			this.nativeStorage.setItem('appLanguage', this.selectedLanguage);
			this.translate.setDefaultLang(this.selectedLanguage);
			let buttons = [{
				text: GlobalVars.translateText('Close'),
				handler: () => {
					this.appCtrl.getActiveNavs()[0].pop();
				}
			}];
			GlobalVars.showAlert(GlobalVars.successMessageTitle,GlobalVars.successMessages.LANGUAGE_CHANGED,buttons);
		}
	}

	ionViewDidLoad() {
		this.fromMenuBar = this.navParams.get('fromMenuBar');
		this.nativeStorage.getItem("appLanguage").then((data)=>{
			this.selectedLanguage = data;
		});
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(LanguageScreenPage.name);
	}
}
