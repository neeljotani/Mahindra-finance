import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Component, ElementRef, Renderer } from '@angular/core';
import { GlobalService } from '../../../app/globalService';
import { GlobalVars } from '../../../app/globalvars';
import { LoginPage } from '../../login/login';
import { Commons } from '../../../app/framework';
import { NativeStorage } from '@ionic-native/native-storage';
import { JSONStoreService } from '../../../app/jsonStoreService';
import { ForgotPinPage } from '../../forgot-pin/forgot-pin';
import { IonicUtil } from '../../../providers/ionic-util';


@Component({
	selector: 'page-set-pin',
	templateUrl: 'set-pin.html',
})
export class SetPinPage {
	pin: string;
	confirmPin: string;
	hidePin = true;
	hideConfirmPin = true;
	mobileNo: string;
	authenticationData: any;
	redirectionFrom: any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public nativeStorage: NativeStorage, public elementRef: ElementRef, public renderer: Renderer, public ionicUtil: IonicUtil) {
	}

	showPin() {
		this.hidePin = !this.hidePin;
	}
	showReenterPin() {
		this.hideConfirmPin = !this.hideConfirmPin;
	}
	ionViewDidLoad() {
		this.authenticationData = this.navParams.get("authenticationData");
		this.mobileNo = this.navParams.get("mobileNo");
		if (this.navParams.get("redirectionFrom") != null && this.navParams.get("redirectionFrom") != undefined)
			this.redirectionFrom = this.navParams.get("redirectionFrom");
		else
			this.redirectionFrom = "";
	}

	continue() {
		if (typeof this.pin != 'undefined' && this.pin.length == 4) {
			if (typeof this.confirmPin != 'undefined' && this.confirmPin.length == 4) {
				if (this.pin == this.confirmPin) {
					Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
					GlobalService.registration(this.mobileNo, this.pin).then((response) => {
						GlobalVars.printLog(SetPinPage.name, "registration success : ", response);
						let finalJSON = this.prepareAuthenticationData();
						if (response.status == 200) {
							GlobalService.saveAuthenticationData(this.mobileNo, finalJSON).then((res) => {
								GlobalVars.printLog(SetPinPage.name, "saveAuthenticationData success : ", res);
								Commons.hideLoadingMask();
								let buttons = [{
									text: GlobalVars.translateText('Ok'),
									handler: () => {
										this.navCtrl.push(LoginPage, {}, GlobalVars.navPushOptions);
									}
								}];
								JSONStoreService.addtoJSON(JSONStoreService.collectionName, { "id": this.mobileNo, "pin": this.pin, "isLocked": false });
								//this.nativeStorage.setItem("userDetails",{"userId":this.mobileNo,"pin":this.pin});
								GlobalVars.showAlert(GlobalVars.successMessageTitle, GlobalVars.successMessages.REGISTRATION_COMPLETED, buttons);
							}, (err) => {
								Commons.hideLoadingMask();
								GlobalVars.printLog(SetPinPage.name, "saveAuthenticationData err : ", err);
								GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
							});
						} else {
							Commons.hideLoadingMask();
							GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
						}
					}, (error) => {
						Commons.hideLoadingMask();
						GlobalVars.printLog(SetPinPage.name, "registration error : ", error);
						GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);
					});

					/* GlobalVars.showAlert(GlobalVars.successMessageTitle,GlobalVars.successMessages.REGISTRATION_COMPLETED);
					this.navCtrl.push(LoginWidthMobileAndAppPinPage); */
				} else {
					GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.PIN_CONFIRM_PIN_NOT_MATCH);
				}
			} else {
				GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_REENTER_PIN);
			}
		} else {
			GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_PIN);
		}
	}

	prepareAuthenticationData() {
		let finalJSON = {
			"executive_detail": [],
			"fd_account_detail": [],
			"vehicle_account_detail": [],
			"repayment_detail": [],
			"asset_detail": [],
		};
		if (typeof this.authenticationData.Exec_Detail != 'undefined' && this.authenticationData.Exec_Detail.length != 0) {
			GlobalVars.databaseTables.EXECUTIVE_DETAIL.ACCOUNT_NUMBER
			this.authenticationData.Exec_Detail.forEach(element => {
				let x = {};
				x[GlobalVars.databaseTables.EXECUTIVE_DETAIL.USER_ID] = this.mobileNo;
				x[GlobalVars.databaseTables.EXECUTIVE_DETAIL.ACCOUNT_NUMBER] = element.AccountNumber;
				x[GlobalVars.databaseTables.EXECUTIVE_DETAIL.BRANCH_NAME] = element.BranchName;
				x[GlobalVars.databaseTables.EXECUTIVE_DETAIL.EXECUTIVE_NAME] = element.HandlingCollectionExecutiveName;
				x[GlobalVars.databaseTables.EXECUTIVE_DETAIL.EXECUTIVE_CONTACT_NUMBER] = element.HandlingCollectionExecutiveContactNumber;
				finalJSON.executive_detail.push(x);
			});
		}
		if (typeof this.authenticationData.Vehicle_Account_summary != 'undefined' && this.authenticationData.Vehicle_Account_summary.length != 0) {
			this.authenticationData.Vehicle_Account_summary.forEach(element => {
				let x = {};
				let y = {};
				let z = {};
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.USER_ID] = this.mobileNo;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.ACCOUNT_CATEGORY] = element.AccountCategory;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.ACCOUNT_NUMBER] = element.AccountNumber;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.ACCOUNT_DATE] = element.AccountDate;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.LOAN_AMOUNT] = element.LoanAmount;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.TOTAL_PAYABLE] = element.TotalPayable;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.RATE_OF_INTEREST] = element.RateOfInterest;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.EMI_AMOUNT] = element.EMIAmount;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.NO_OF_INSTALMENTS] = element.NoOfInstalments;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.REFINANCE] = element.Refinance;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.REPAYMENT_MODE] = element.RepaymentMode;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.FREQUENCY] = element.Frequency;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.LOAN_END_DATE] = element.LoanEndDate;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.CUSTOMER_NAME] = element.CustomerName;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.GUARANTOR_NAME] = element.GuarantorName;
				x[GlobalVars.databaseTables.VEHICLE_ACCOUNT_DETAIL.CO_APPLICANT_NAME] = element.CoApplicantName;

				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.USER_ID] = this.mobileNo;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.ACCOUNT_NUMBER] = element.AccountNumber;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.TOTAL_EMIS_PAID] = element.TotalEMIsPaid;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.EMIS_REMAINING] = element.EMIsRemaining;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.LAST_EMI_PAID_DATE] = element.LastEMIPaidDate;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.NEXT_EMI_DUE_DATE] = element.NextEMIDueDate;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.OUTSTANDING_AMOUNT] = element.Outstanding;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.TOTAL_AMOUNT_PAID] = element.TotalAmountPaid;
				y[GlobalVars.databaseTables.REPAYMENT_DETAIL.TOTAL_AMOUNT_DUE] = element.TotalAmountDue;

				//x[GlobalVars.databaseTables.vehicle_account_detail.user_id]= element.RegisteredMobileNumber;
				z[GlobalVars.databaseTables.ASSET_DETAIL.USER_ID] = this.mobileNo;
				z[GlobalVars.databaseTables.ASSET_DETAIL.VEHICLE_REGISTRATION_NO] = element.VehicleRegistrationNo;
				z[GlobalVars.databaseTables.ASSET_DETAIL.MANUFACTURER] = element.Manufacturer;
				z[GlobalVars.databaseTables.ASSET_DETAIL.ENGINE_NUMBER] = element.EngineNumber;
				z[GlobalVars.databaseTables.ASSET_DETAIL.CHASSIS_NUMBER] = element.ChassisNumber;
				z[GlobalVars.databaseTables.ASSET_DETAIL.DEALER_NAME] = element.DealerName;
				z[GlobalVars.databaseTables.ASSET_DETAIL.ACCOUNT_NUMBER] = element.AccountNumber;

				finalJSON.vehicle_account_detail.push(x);
				finalJSON.repayment_detail.push(y);
				finalJSON.asset_detail.push(z);
			});

			if (typeof this.authenticationData.Vehicle_Loan != 'undefined' && this.authenticationData.Vehicle_Loan.length != 0) {
				for (let i = 0; i < this.authenticationData.Vehicle_Loan.length; i++) {
					finalJSON.asset_detail[i][GlobalVars.databaseTables.ASSET_DETAIL.VEHICLE_MODEL_NAME] = this.authenticationData.Vehicle_Loan[i].Asset;
				}
			}
		}
		if (typeof this.authenticationData.FD_Account_summary != 'undefined' && this.authenticationData.FD_Account_summary.length != 0) {
			this.authenticationData.FD_Account_summary.forEach(element => {
				let x = {};
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.USER_ID] = this.mobileNo;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.ACCOUNT_NUMBER] = element.AccountNumber;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.ACCOUNT_CATEGORY] = element.AccountCategory;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.START_DATE] = element.StartDate;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.DURATION] = element.Duration;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.INVESTMENT_AMOUNT] = element.InvestmentAmount;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.ROI] = element.Roi;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.MATURITY_AMOUNT] = element.MaturityAmount;
				x[GlobalVars.databaseTables.FD_ACCOUNT_DETAIL.MATURITY_DATE] = element.MaturityDate;
				finalJSON.fd_account_detail.push(x);
			});
		}
		GlobalVars.printLog(SetPinPage.name, "Final JSON : ", finalJSON);
		return finalJSON;
	}
	onKeyPressed(event, id) {
		let self = this;
		this.ionicUtil.onPinChange(self, event, id);

	}
	nextStep() {
		if (this.redirectionFrom == (ForgotPinPage.name)) {
			this.setPin()

		} else {
			this.continue();
		}
	}

	setPin() {

		if (typeof this.pin != 'undefined' && this.pin.length == 4) {
			if (typeof this.confirmPin != 'undefined' && this.confirmPin.length == 4) {
				if (this.pin == this.confirmPin) {
					Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
					let requestParams = {};
					let whereParams = {};
					requestParams[GlobalVars.databaseTables.USER_DETAIL.PIN] = GlobalVars.encryptPin(this.confirmPin);
					whereParams[GlobalVars.databaseTables.USER_DETAIL.ID] = this.mobileNo;

					;
					GlobalService.updateData(requestParams, whereParams, GlobalVars.USER_DETAIL_TABLE_NAME).then((result) => {
						GlobalVars.printLog("Set Pin", "updateData response : ", result);
						if (result.status == 200 && result.responseJSON.status == "success") {
							Commons.hideLoadingMask();
							JSONStoreService.updateUserDetail(JSONStoreService.collectionName,this.mobileNo,"pin",GlobalVars.encryptPin(this.confirmPin));
							let buttons = [{
								text: GlobalVars.translateText('Ok'),
								handler: () => {
									this.navCtrl.push(LoginPage, {}, GlobalVars.navPushOptions);
								}
							}];

							GlobalVars.showAlert(GlobalVars.successMessageTitle, GlobalVars.successMessages.PIN_UPDATE_SUCCESSFULLY, buttons);

						} else {
							Commons.hideLoadingMask();
							GlobalVars.printLog(SetPinPage.name, "registration error : ", JSON.stringify(result));
							GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);


						}
					}, (err) => {
						Commons.hideLoadingMask();
						GlobalVars.printLog(SetPinPage.name, "registration error : ", err);
						GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.webServiceErrorMessage);


					});
				}
				else {
					GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.PIN_CONFIRM_PIN_NOT_MATCH);
				}
			} else {
				GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_REENTER_PIN);
			}
		} else {
			GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_PIN);
		}


	}
	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(SetPinPage.name);
	}
}
