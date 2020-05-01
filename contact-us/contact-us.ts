import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BranchLocatorPage } from '../branch-locator/branch-locator';
import { GlobalVars } from '../../app/globalvars';

@Component({
  selector: 'page-contact-us',
  templateUrl: 'contact-us.html',
})
export class ContactUsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToBranchLocator(){
    this.navCtrl.push(BranchLocatorPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactUsPage');
  }

  ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(ContactUsPage.name);
	}
}
