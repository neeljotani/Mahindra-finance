import { AlertController, Alert, App, NavOptions } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import jsSHA from "jssha";
import { Commons, AppConfig } from "./framework";
import { User } from "./user";
import { LoginPage } from "../pages/login/login";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderReverseResult } from "@ionic-native/native-geocoder";
import { Geolocation } from "@ionic-native/geolocation";

export class GlobalVars {
    public static alertCtrl: AlertController;
    public static alert: Alert;
    public static appCtrl: App;
    public static logger: any;
    public static webServiceErrorMessage: string = "Something went wrong! Please try again later.";
    public static translate: TranslateService;
    public static errorMessageTitle: string = "Error";
    public static successMessageTitle: string = "Success";
    public static informationMessageTitle: string = "Information";
    public static loginCount: number = 0;
    public static maxLoginAttempts: number = 5;
    public static loadingMaskMessage: string = "Please wait ...";
    public static isAlertShow: boolean = false;
    public static isOnline : boolean = true;
    public static lastLoginId : string = "";
    public static googleAnalytics :GoogleAnalytics;
    public static geoLocation : Geolocation;
    public static nativeGeocoder : NativeGeocoder;
    public static GOOGLE_ANALYTICS_TRACKER_ID : any = "UA-126986523-1";   // UAT
   //  public static GOOGLE_ANALYTICS_TRACKER_ID : any = "UA-127355296-1";  // LOCAL
   

    public static USER_DETAIL_TABLE_NAME: string = "user_detail";
    public static EXECUTIVE_DETAIL_TABLE_NAME: string = "executive_detail";
    public static FD_ACCOUNT_DETAIL_TABLE_NAME: string = "fd_account_detail";
    public static VEHICLE_ACCOUNT_DETAIL_TABLE_NAME: string = "vehicle_account_detail";
    public static REPAYMENT_DETAIL_TABLE_NAME: string = "repayment_detail";
    public static ASSET_DETAIL_TABLE_NAME: string = "asset_detail";
    public static OTP_AUTHENTICATION_TABLE_NAME: string = "otp_authentication";
    public static PAYMENT_DETAIL_TABLE_NAME: string = "payment_detail";
    public static LOCAL_NOTIFICATION_TABLE_NAME: string = "local_notification";

    public static successMessages = {
        REGISTRATION_COMPLETED: "Registration successfully completed",
        LANGUAGE_CHANGED : "Default language successfully set",
        OFFER_ACCEPTED : "You have successfully applied for the offer",
        PIN_CHANGED : "You have changed your pin successfully",
        EVENT_CREATED : "You have successfully created an reminder",
        PIN_UPDATE_SUCCESSFULLY : "PIN successfully updated. Kindly login using new PIN."
    }
    public static errorMessages = {
        INVALID_LOGIN_MOBILE_NO: "Please enter Registered Mobile number",
        INVALID_REGISTRATION_MOBILE_NO: "Please enter valid mobile number.",
        INVALID_OTP_LENGTH: "OTP must of 6 digits",
        OTP_NOT_MATCH: "Enter valid OTP",
        OTP_EXPIRED : "OTP has expired.",
        INVALID_PIN: "Please set a 4-digit PIN",
        INVALID_REENTER_PIN: "Please re-enter 4-digit PIN",
        PIN_CONFIRM_PIN_NOT_MATCH: "PIN entered do not match",
        INVALID_LOGIN_PIN: "Please enter 4-digit PIN",
        APP_LOCK: "Your Account is locked. Please try again after 2 hours",
        APP_LOCK_OFFLINE : "Your Account is locked. Please go online for more details",
        INVALID_CREDENTIALS : "Invalid credentials",
        NO_DATA_FOUND_ON_CACHE : "No data found on device",
        REGISTRATION_RESTRICTED : "You can't register in offline mode",
        NO_BRANCH_FOUND : "No Branches found for entered pincode",
        INVALID_PINCODE : "Please enter pincode",
        REPAYMENT_SCHEDULE_DATA_NOT_FOUND : "No repayment schedule data for account number",
        NO_CASH_PAYMENT_POINT_FOUND : "No Cash Payment Point found for entered pincode",
        OFFLINE_MODE_ERROR : "Kindly go online to access this feature",
        INCORRECT_PIN: "Existing Pin Entered is Incorrect",
        REPAYMENT_SCHEDULE_DATE_NOT_SELECTED : "Kindly select how many days prior you want a reminder.",
        NEW_OLD_PIN_SAME : "New PIN cannot be same as current PIN.",
        NEW_CONFIRM_PIN_NOT_MATCH : "New PIN does not match the confirm PIN."
    }

    public static informationMessages = {
        ALREADY_REGISTERED: "The entered number is already registered.",
        NO_EMIs_REMAINING : "Reminder cannot be set, since no EMIs are remaining.",
        NO_NEXT_EMI_DATE : "Reminder cannot be set since no date of EMI is available.",
        NOT_REGISTERED : "This is not a valid registered number. Kindly enter the number registered with Mahindra Finance."
    }

    public static navPushOptions : NavOptions = {
        animate : true,
        direction : "forward",
        animation : "transition",
        duration : 300
    }

    public static navPopOptions : NavOptions = {
        animate : true,
        direction : "back",
        animation : "transition",
        duration : 300
    }

    public static getRemainingAttempts() {
        return GlobalVars.maxLoginAttempts - GlobalVars.loginCount;
    }
    
    //OTP Status send by the adapter
    public static OTP_STATUS = {
        OTP_MATCH  : 200,
        OTP_EXPIRED : 300,
        OTP_NOT_MATCH : 400
    }
    public static databaseTables = {
        "USER_DETAIL": {
            ID: "id",
            PIN: "pin",
            REGISTRATION_DATE: "registration_date",
            LAST_LOGIN_DATE: "last_login_date",
            IS_REGISTERED: "is_registered",
            IS_LOCKED: "is_locked",
            LOCK_DATE: "lock_date"
        },
        "EXECUTIVE_DETAIL": {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            BRANCH_NAME: "branch_name",
            EXECUTIVE_NAME: "executive_name",
            EXECUTIVE_CONTACT_NUMBER: "executive_contact_number",
        },
        "FD_ACCOUNT_DETAIL": {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            ACCOUNT_CATEGORY: "account_category",
            START_DATE: "start_date",
            DURATION: "duration",
            INVESTMENT_AMOUNT: "investment_amount",
            ROI: "roi",
            MATURITY_AMOUNT: "maturity_amount",
            MATURITY_DATE:"maturity_date"
        },
        "VEHICLE_ACCOUNT_DETAIL": {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            ACCOUNT_CATEGORY: "account_category",
            ACCOUNT_DATE: "account_date",
            LOAN_AMOUNT: "loan_amount",
            TOTAL_PAYABLE: "total_payable",
            RATE_OF_INTEREST: "rate_of_interest",
            EMI_AMOUNT: "emi_amount",
            NO_OF_INSTALMENTS: "no_of_instalments",
            REFINANCE: "refinance",
            REPAYMENT_MODE: "repayment_mode",
            FREQUENCY: "frequency",
            LOAN_END_DATE: "loan_end_date",
            CUSTOMER_NAME: "customer_name",
            GUARANTOR_NAME: "guarantor_name",
            CO_APPLICANT_NAME: "co_applicant_name",
        },
        "REPAYMENT_DETAIL": {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            EMIS_REMAINING: "emis_remaining",
            LAST_EMI_PAID_DATE: "last_emi_paid_date",
            NEXT_EMI_DUE_DATE: "next_emi_due_date",
            TOTAL_EMIS_PAID: "total_emis_Paid",
            OUTSTANDING_AMOUNT: "outstanding_amount",
            TOTAL_AMOUNT_PAID: "total_amount_paid",
            TOTAL_AMOUNT_DUE: "total_amount_due",
        },
        "ASSET_DETAIL": {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            VEHICLE_REGISTRATION_NO: "vehicle_registration_no",
            VEHICLE_MODEL_NAME: "vehicle_model_name",
            ENGINE_NUMBER: "engine_number",
            CHASSIS_NUMBER: "chassis_number",
            DEALER_NAME: "dealer_name",
            MANUFACTURER: "manufacturer",
        },
        "OTP_AUTHENTICATION": {
            USER_ID: "user_id",
            OTP: "otp",
            OTP_SEND_DATE: "otp_send_date",
            OTP_VALIDATED_DATE: "otp_validated_date",
            IS_AUTHENTICATED: "is_authenticated"
        },
        "PAYMENT_DETAIL": {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            AMOUNT: "amount",
            EMAIL_ID: "email_id",
            PAYMENT_MODE: "payment_mode",
            TRANSACTION_DATE: "transaction_date",
            PAYMENT_REQUEST: "payment_request",
            PAYMENT_RESPONSE: "payment_response",
            PAYMENT_STATUS: "payment_status"
        },
        "LOCAL_NOTIFICATION" : {
            USER_ID: "user_id",
            ACCOUNT_NUMBER: "account_number",
            TITLE : "event_title",
            MESSAGE:"event_message",
            START_DATE : "event_start_date",
            END_DATE: "event_end_date",
            RECURRENCE :"recurrence",
            RECURRENCE_END_DATE : "recurrence_end_date",
            NO_OF_EMI : "no_of_emi",
            MIN_START_DATE : "min_start_date",
            MAX_END_DATE : "max_end_date"
        }
    }

    static initialize(alertCtrl: AlertController, translate: TranslateService, appCtrl: App,googleAnalytics : GoogleAnalytics,geoLocation : Geolocation,nativeGeocoder : NativeGeocoder) {
        GlobalVars.alertCtrl = alertCtrl;
        GlobalVars.translate = translate;
        GlobalVars.appCtrl = appCtrl;
        GlobalVars.googleAnalytics = googleAnalytics;
        GlobalVars.geoLocation =  geoLocation;
        GlobalVars.nativeGeocoder = nativeGeocoder;

    }

    static showAlert(title, message, buttons?) {
        if (GlobalVars.alert != null) {
            GlobalVars.alert.dismiss();
            GlobalVars.alert = null
        }

        GlobalVars.alert = GlobalVars.alertCtrl.create({
            title: GlobalVars.translateText(title),
            message: GlobalVars.translateText(message),
            buttons: (typeof buttons != 'undefined' && buttons != null) ? buttons : [GlobalVars.translateText('Ok')]
        });

        /* GlobalVars.alert = GlobalVars.alertCtrl.create({
            title: title,
            message: message,
            buttons: (typeof buttons != 'undefined' && buttons != null) ? buttons : ['Ok']
        }); */

        GlobalVars.alert.willEnter.subscribe(x => {
            GlobalVars.isAlertShow = true;
        });
        GlobalVars.alert.willLeave.subscribe(x => {
            GlobalVars.isAlertShow = false;
            console.log("Alert is leaving");
        });
        GlobalVars.alert.present();
    }

    static hideAlert() {
        if (GlobalVars.alert != null) {
            GlobalVars.alert.dismiss();
            GlobalVars.alert = null;
        }
    }

    public static translateText(value: string) {
        return this.translate.instant(value);
    }
    public static encryptPin(pin: string): string {
        let encryptedPin: string = pin;
        let shaObj = new jsSHA("SHA-256", "TEXT");
        shaObj.update(pin);
        encryptedPin = shaObj.getHash("HEX");
        return encryptedPin;
    }

    public static printLog(packageName: string, message: string, data: any) {
        GlobalVars.logger = Commons.getLogger(packageName);
        GlobalVars.logger.info(message, data);
        console.log(packageName, message, data);
    }

    public static getOTPFromMessage(message: string): string {
        let numberFormat = /\d+/g;
        let otp;
        while ((otp = numberFormat.exec(message)) != null) {
            return otp;
        }
    }

    public static logout() {
        this.logger.info("In performLogout");
        let buttons = [{
            text: GlobalVars.translateText("No"),
            role: 'cancel',
            handler: () => { }
        },{
            text: GlobalVars.translateText("Yes"),
            handler: () => {
                //this.appCtrl.getRootNavs()[0].popToRoot();
                this.appCtrl.getRootNavs()[0].setRoot(LoginPage);
                if(User.getLoggedInUser().getIsOnlineLogin()){
                    WLAuthorizationManager.logout(AppConfig.auth.securityCheck).then(() => {
                        this.logger.debug("logout success");
                    }, (response) => {
                        this.logger.debug("Login Error", JSON.stringify(response));
                        this.logger.debug("logout failed");
                    });
                }
                User.destroyUserObject();
            }
        }];
        GlobalVars.showAlert("Logout", "Are you sure you want to Log Out?", buttons);
    }

    public static startTrackerWithId(){
        this.googleAnalytics.startTrackerWithId(GlobalVars.GOOGLE_ANALYTICS_TRACKER_ID).then(() => {
            console.log('Google analytics is ready now');
            
            // Tracker is ready
            // You can now track pages or set additional information such as AppVersion or UserId
          })
          .catch(e => console.log('Error starting GoogleAnalytics', e));
    }
    public static googleAnalyticsTrackView(pageName){

        this.googleAnalytics.startTrackerWithId(GlobalVars.GOOGLE_ANALYTICS_TRACKER_ID).then(() => {
          this.printLog("GOOGLE ANALYTICS : ",'Google analytics Track View Success',{});
           this.googleAnalytics.trackView(pageName);

           if(User.getLoggedInUser() != null && User.getLoggedInUser()!= undefined ){

            this.googleAnalytics.addCustomDimension(1,User.getLoggedInUser().getUserId());
           }
        }) .catch(e => console.log('Error starting GoogleAnalytics', e));
    }

    public static googleAnalyticsTrackEvents(category,event,label)
    {   
      this.googleAnalytics.startTrackerWithId(GlobalVars.GOOGLE_ANALYTICS_TRACKER_ID).then(() => {
       
            this.googleAnalytics.trackEvent(category, event, category)
            if(User.getLoggedInUser() != null && User.getLoggedInUser()!= undefined ){

                this.googleAnalytics.addCustomDimension(1,User.getLoggedInUser().getUserId());
               }
            this.printLog("GOOGLE ANALYTICS : ",'Track Event Success',{});
            }).catch(e => console.log('Error starting GoogleAnalytics', e));

    }

    public static getUserLocation() : any{
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
        let  response ={
            latitude : 0,
            longitude : 0,
            status :1,
            message : "Success"
        };
		this.geoLocation.getCurrentPosition().then((resp) => {

			GlobalVars.printLog(GlobalVars.name,"GEOLOCATIOn SUCCESS : ",resp.coords);
            //this.getPinCode(resp.coords.latitude,resp.coords.longitude);
            response.latitude = resp.coords.latitude;
            response.longitude = resp.coords.longitude;
            resolve(response);
			
		   }).catch((error) => {
             console.log('Error getting location', error);
             response.status=0;
             response.message = error;
             reject(response);
           });
        });
           return promise;

	}

	public static getPinCode(lat,long) : any {
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
        let  response ={
            status :1,
            result : {}
        };
		let options: NativeGeocoderOptions = {
			useLocale: true,
			maxResults: 5
		};
		
		this.nativeGeocoder.reverseGeocode(lat, long, options)
          .then((result: NativeGeocoderReverseResult[]) =>{

              console.log(JSON.stringify(result));
              response.result = result[1];
              GlobalVars.printLog(GlobalVars.name,"LOCATION SUCCESS",JSON.stringify(result[1]));
              resolve(response);

        } )
		  .catch((error: any) => {
              console.log(error);
              response.status =0; 
              response.result = error;
              reject(response);
            });
        });
          return promise;
    }
   

}