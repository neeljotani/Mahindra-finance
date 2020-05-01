import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';

@Component({
	selector: 'page-menu',
	templateUrl: 'menu.html',
})
export class MenuPage {

	constructor(public appCtrl: App,public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MenuPage');
	}
	close() {
		this.viewCtrl.dismiss();
	}
	gotopage(page) {
		this.viewCtrl.dismiss(page);
	}

	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(MenuPage.name);
	}
}
