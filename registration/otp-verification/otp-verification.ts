import { Component, HostListener } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../../app/globalvars';
import { GlobalService } from '../../../app/globalService';
import { SetPinPage } from '../set-pin/set-pin';
import { Timer } from '../../../providers/timer/timer';
import { IonicUtil } from '../../../providers/ionic-util';

declare var SMS : any;
@Component({
	selector: 'page-otp-verification',
	templateUrl: 'otp-verification.html',
})
export class OtpVerificationPage {
	mobileNo: string;
	otp: string;
	minleft:any=4;
	timeleft:any=59;
	otpExipre : boolean = false;
	authenticationData : any;
	redirectionFrom : any;
	showLink: boolean = false;
	@HostListener('document:onSMSArrive', ['$event'])
	onSMSArrive(response){
		GlobalVars.printLog(OtpVerificationPage.name,"Response",JSON.stringify(response));
		if( new RegExp("\\b" + "MMFSLT" + "\\b").test(response.data.address)){
			this.otp=GlobalVars.getOTPFromMessage(response.data.body)[0];
		}
	}
	constructor(public navCtrl: NavController, public navParams: NavParams,public myTimer : Timer,public ionicUtil : IonicUtil) {
	}

	nextPage() {
		if (typeof this.otp == "undefined" || this.otp.length != 6) {
			GlobalVars.showAlert(GlobalVars.errorMessageTitle, GlobalVars.errorMessages.INVALID_OTP_LENGTH);
		} else{
			GlobalService.validateOTP(this.mobileNo,this.otp).then((res)=>{
				GlobalVars.printLog(OtpVerificationPage.name,"validate OTP success : ",res);
				if(res.responseJSON.status == GlobalVars.OTP_STATUS.OTP_MATCH){
					this.navCtrl.push(SetPinPage,{"mobileNo":this.mobileNo,"authenticationData":this.authenticationData,"redirectionFrom":this.redirectionFrom},GlobalVars.navPushOptions);
				}else if(res.responseJSON.status == GlobalVars.OTP_STATUS.OTP_EXPIRED){
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.OTP_EXPIRED);
					this.otp = "";
					this.otpExipre = true;
				}else if(res.responseJSON.status == GlobalVars.OTP_STATUS.OTP_NOT_MATCH){
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.OTP_NOT_MATCH);
					this.otp = "";
				}else{
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
					this.otp = "";
				}
			},(err)=>{
				GlobalVars.printLog(OtpVerificationPage.name,"validate OTP error : ",err);
				GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
			});
		}
	}

	ionViewDidLoad() {
		this.mobileNo = this.navParams.get("mobileNo");
		this.authenticationData = this.navParams.get("authenticationData");
		if(this.navParams.get("redirectionFrom")!=null && this.navParams.get("redirectionFrom")!=undefined)
			this.redirectionFrom = this.navParams.get("redirectionFrom");
			else
			this.redirectionFrom ="";

	}

	ionViewWillEnter(){
		if(SMS) SMS.startWatch((res)=>{
			GlobalVars.printLog(OtpVerificationPage.name,"watching",res);
		}, (err)=>{
			GlobalVars.printLog(OtpVerificationPage.name,"Failed to start watching",err);
		});
	}
	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(OtpVerificationPage.name);
		this.otp = "";
		this.sendOTP();
	}

	ionViewDidLeave(){
		if(SMS) SMS.stopWatch(()=>{
			GlobalVars.printLog(OtpVerificationPage.name,"stop watching",{});
		}, function(){
			GlobalVars.printLog(OtpVerificationPage.name,"Failed to stop watching",{});
		});
	}

	sendOTP(){
		this.otp="";
		this.showLink=false;
		this.otpExipre=false;
		this.myTimer.startTimer(false,4,59).subscribe(data => {
			this.minleft = data.minutes;
			this.timeleft = data.seconds;
			if(data.minutes == 0 && data.seconds == 0){
				this.showLink = true;
				this.otpExipre = true;
			}
		});
		GlobalService.sendOTP(this.mobileNo).then((res)=>{
			GlobalVars.printLog(OtpVerificationPage.name,"send OTP success : ",res);
		},(err)=>{
			this.showLink = true;
			this.otpExipre = true;
			this.myTimer.stopTimer();
			GlobalVars.printLog(OtpVerificationPage.name,"send OTP error : ",err);
		});
	}

	onOTPChange(event: any) {
		
		let self = this;
		this.ionicUtil.onPinChange( self, event, "#btnSubmit",6);

	}

	clearOTP(event: any){
		this.ionicUtil.clearInputField(event);	
	}
}
