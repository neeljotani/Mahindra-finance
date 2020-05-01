import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalService } from '../../app/globalService';
import { Commons } from '../../app/framework';
import { GlobalVars } from '../../app/globalvars';

@Component({
	selector: 'page-branch-locator',
	templateUrl: 'branch-locator.html',
})
export class BranchLocatorPage {

	pincode: string;
	showDetails : boolean = false;
	branchDetails = [];
	constructor(public navCtrl: NavController, public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BranchLocatorPage');
	}
	ionViewDidEnter(){
		GlobalVars.googleAnalyticsTrackView(BranchLocatorPage.name);
	}
	getBranchDetails() {
		if(typeof this.pincode == 'undefined' || this.pincode == ""){
			this.showDetails = false;
			this.pincode = "";
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.INVALID_PINCODE);
		}else{

			if(GlobalVars.isOnline){
				Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
			this.branchDetails = [];
			GlobalService.getBranchDetails(this.pincode).then((res) => {
				Commons.hideLoadingMask();
				console.log("Branchdetails response : ",res);
				if(res.responseJSON.StatusCode == 200){
					if(res.responseJSON.Branch_Master.Status == "SUCCESS"){
						let branchDetail = res.responseJSON.Branch_Master.data;
						branchDetail.forEach(element => {
							let details = {};
							details["location"] = element.State_Des;
							details["contact"] = element.Office_Phone;
							details["address"] = "";
							if(element.Place_Premises != null && element.Place_Premises != "null")
								details["address"]+=element.Place_Premises+" ";
							if(element.Road != null && element.Road != "null")
								details["address"]+=element.Road;
							if(element.Landmark != null && element.Landmark != "null")
								details["address"]+=element.Landmark+" ";
							if(element.Post_office != null && element.Post_office != "null")
								details["address"]+=element.Post_office+" ";
							if(element.city_town != null && element.city_town != "null")
								details["address"]+=element.city_town+" ";
							if(element.District_Des != null && element.District_Des != "null")
								details["address"]+=element.District_Des+" ";
							if(element.Taluk != null && element.Taluk != "null")
								details["address"]+=element.Taluk+" ";
							if(element.Pin_code != null && element.Pin_code != "null")
								details["address"]+=element.Pin_code+" ";
							console.log("updated branch details : " , details);
							this.branchDetails.push(details);
						});
						this.showDetails = true;
					}else{
						this.showDetails = false;
					}
				}else{
					this.showDetails = false;
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.NO_BRANCH_FOUND);
				}
			},(err)=>{
				console.log("Branchdetails err : ",err);
				this.showDetails = false;
				Commons.hideLoadingMask();
				GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
			});
			}else{
				GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.errorMessages.OFFLINE_MODE_ERROR);
			}
			
		}
		
	}

	getPincodeViaUserLocation(){
		this.branchDetails = [];
		this.showDetails = false;
		Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
		this.pincode = "";
		if(GlobalVars.isOnline){
			GlobalVars.getUserLocation().then((resp)=>{
				GlobalVars.printLog(BranchLocatorPage.name,"LOCATION SUCCESS",JSON.stringify(resp));
				GlobalVars.getPinCode(resp.latitude,resp.longitude).then((response) => {
					GlobalVars.printLog(BranchLocatorPage.name,"GET PIN CODE SUCCESS",JSON.stringify(response));
						this.pincode = response.result.postalCode;
						Commons.hideLoadingMask();
	
				}).catch((err) => {
					GlobalVars.printLog(BranchLocatorPage.name,"GET PIN CODE ERROR",JSON.stringify(err));
					Commons.hideLoadingMask();	
				});
	
			}).catch((err) => {
				GlobalVars.printLog(BranchLocatorPage.name,"LOCATION ERROR",JSON.stringify(err));
				Commons.hideLoadingMask();
			});
		}else{
			GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.errorMessages.OFFLINE_MODE_ERROR);
			Commons.hideLoadingMask();
		}
		
	
	
	  }
}
