import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PreLoginPage } from '../pre-login/pre-login';
import { GlobalVars } from '../../app/globalvars';

@Component({
	selector: 'page-app-introduction',
	templateUrl: 'app-introduction.html',
})
export class AppIntroductionPage {
	logger : any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}
	next() {
		this.navCtrl.push(PreLoginPage,{},GlobalVars.navPushOptions);
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(AppIntroductionPage.name);
	}
}
