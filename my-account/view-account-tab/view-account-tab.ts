import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AccountDetailsPage } from '../account-details/account-details';
import { RepaymentDetailsPage } from '../repayment-details/repayment-details';
import { GlobalVars } from '../../../app/globalvars';

@Component({
  selector: 'page-view-account-tab',
  templateUrl: 'view-account-tab.html',
})
export class ViewAccountTabPage {

  accountDetail = AccountDetailsPage;
  accountRepaymentDetail = RepaymentDetailsPage;
  accountData : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.accountData = this.navParams.get('accountData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewAccountTabPage');
  }
  ionViewDidEnter(){
    GlobalVars.printLog(ViewAccountTabPage.name,"Accound Data : ",this.navParams.get('accountData'));
      GlobalVars.googleAnalyticsTrackView(ViewAccountTabPage.name);
	}
}
