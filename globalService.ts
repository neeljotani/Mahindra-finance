import { MMFSLService } from "./MMFSLService";
import { GlobalVars } from "./globalvars";
import { NavController } from "ionic-angular";
import { UserBean, User } from "./user";
import { Commons } from "./framework";
import { NativeStorage } from "@ionic-native/native-storage";
import { UserLogin } from "./mobilefirst/UserLogin";
import { JSONStoreService } from "./jsonStoreService";

export class GlobalService {
    //Registration -> Authentication API
   

    

    public static authentication(mobileNo : string){

        GlobalVars.googleAnalyticsTrackEvents("Login","Authentication","User Authentication");

        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "MobileNo":mobileNo
            }
            MMFSLService.callAdapter("MFWebServiceAdapter","authentication","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;       
    }
    public static sendOTP(mobileNo : string){
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "mobileNo":mobileNo,
                "msgType":"AR"
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","sendOTP","GET",parameters).then((response)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService sendOTP response : ", response);
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });

        // Google Analytics Event Tracking
        GlobalVars.googleAnalyticsTrackEvents("Registration","Send Otp","Send Otp");
        return promise;       
    }
    public static validateOTP(mobileNo : string,otp : string){
        GlobalVars.googleAnalyticsTrackEvents("Registration","validate Otp","Validate Otp");

        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "mobileNo":mobileNo,
                "otp" : otp
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","validateOTP","GET",parameters).then((response)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService validateOTP response : ", response);
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;       
    }
    public static getUser(mobileNo : string){
        GlobalVars.googleAnalyticsTrackEvents("Login","Get user","Get User");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "userId":mobileNo
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","getUser","GET",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService getUser error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;       
    }
    public static updateData(requestParams : any,whereParams : any,tableName : string){
        GlobalVars.googleAnalyticsTrackEvents("Login","Update Data ","Update Data");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "whereParams" : JSON.stringify(whereParams),
                "requestParams" : JSON.stringify(requestParams),
                "tableName" : tableName
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","updateData","GET",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService updateData error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;       
    }
    public static saveAuthenticationData(userId : string,data : any){
        GlobalVars.googleAnalyticsTrackEvents("Login","Save Authentication Data ","Save Authentication Data ");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "userId":userId,
                "data":JSON.stringify(data)
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","saveAuthenticationData","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService saveAuthenticationData error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;       
    }
    public static registration(userId : string,pin : string){
        GlobalVars.googleAnalyticsTrackEvents("Registration","Registration","Registration");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "userId": userId,
                "pin": GlobalVars.encryptPin(pin)
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","registration","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService registration error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static getUserAllData(userId : string){
        GlobalVars.googleAnalyticsTrackEvents("Login","Get User All Data","Get User All Data ");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "userId": userId,
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","getAllTableData","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService registration error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;

    }

    public static acceptOfferDetails (params : any){
        GlobalVars.googleAnalyticsTrackEvents("Accept Offer","Accept offer Details","Accept offer Details");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "params":JSON.stringify(params)
            }
            MMFSLService.callAdapter("MFWebServiceAdapter","acceptOfferDetails","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static getBranchDetails (pincode : any){
        GlobalVars.googleAnalyticsTrackEvents("Branch Details","Get Branch Details","Get Branch Details");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "pincode": pincode,
            }
            MMFSLService.callAdapter("MFWebServiceAdapter","getBranchDetails","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static getRepaymentScheduleDetails (accountNumber : any){
        GlobalVars.googleAnalyticsTrackEvents("Payment","Get Repayment Schedule Details","Get Repayment Schedule Details");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "accountNumber": accountNumber,
            }
            MMFSLService.callAdapter("MFWebServiceAdapter","repaymentSchedule","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static getLastPaymentDetails (accountNumber : any){
        GlobalVars.googleAnalyticsTrackEvents("Payment","Get Last Payment Details","Get Last Payment Details");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "accountNumber": accountNumber,
            }
            MMFSLService.callAdapter("MFWebServiceAdapter","getLastPaymentDetails","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static saveAndRetriveLocalNotification (requestParams : any,whereParams : any, tableName : string){
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "requestParams" : requestParams,
                "whereParams" : whereParams,
                "tableName" : tableName
            }
            MMFSLService.callAdapter("DatabaseServiceAdapter","saveAndRetriveLocalNotification","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static login(userLogin: UserLogin,userId: string,pin : string ="",navCtrl : NavController,nativeStorage : NativeStorage) {
        GlobalVars.googleAnalyticsTrackEvents("Login","Login","Login");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            pin = GlobalVars.encryptPin(pin);
            
            userLogin.login(userId, pin).then((data) => {
                GlobalVars.printLog(GlobalVars.name,"Login data : ",data);
                WL.Analytics.log({ "login": "success" });
                let userInfo: UserBean = new UserBean();
                
                userInfo.setUserId(data.user.attributes.userId);
                userInfo.setIsRegistered(data.user.attributes.isRegistered == "1" ? true : false);
                userInfo.setLastLoginDate(data.user.attributes.lastLoginDate);
                /* userInfo.setPin(data.user.attributes.pin); */
                userInfo.setRegistrationDate(data.user.attributes.registrationDate);
                userInfo.setIsLocked(data.user.attributes.isLocked == "1" ? true : false);
                userInfo.setIsOnlineLogin(true);
                //userInfo.setExtraDetails(data.user.attributes.extraDetails);
                User.setLoggedInUser(userInfo);
                let userDetail = {
                    "id" : data.user.attributes.userId,
                    "pin" : data.user.attributes.pin,
                    "lastLoginDate" : data.user.attributes.lastLoginDate,
                    "extraDetails" : {},
                    "isLocked" : data.user.attributes.isLocked == "1" ? true : false
                };
                GlobalVars.printLog("LoginPage","Logged in user Info : ",userInfo);
                
                JSONStoreService.addtoJSON(JSONStoreService.collectionName,userDetail);
                Commons.hideLoadingMask();
                GlobalVars.loginCount = 0;
                resolve();
                //navCtrl.push(DashboardTabPage);
            })
            .catch((error) => {
                GlobalVars.printLog("LoginPage","Login error : ",error);
                Commons.hideLoadingMask();
                WL.Analytics.log({ "login": "failure" });
                // this.logger.info("Login failure", JSON.stringify(error));
                GlobalVars.printLog("LoginPage","Last login ID : ",GlobalVars.lastLoginId);
                GlobalVars.printLog("LoginPage","Mobile number : ",userId);
                
                this.checkLoginError(error,userId).then((res)=>{
                    let errorMessage = res.errorMessage;
                    let errorTitle = res.errorTitle;
                    GlobalVars.showAlert(errorTitle,errorMessage);
                    reject();
                });
            });
        });
        return promise;
    }

    static checkLoginError(error,userId){
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let res = {
                errorMessage : "",
                errorTitle : ""
            };
            if (error.status == -1 || error.status == 0) {
                res.errorMessage = "Unable to connect to Server";
                res.errorTitle = "Try again";
                resolve(res);
            } else if(typeof error.errorMsg != 'undefined' && error.errorCode == 400){
                if( GlobalVars.lastLoginId == userId){
                    GlobalVars.loginCount++;
                }else{
                    GlobalVars.loginCount = 1;
                    GlobalVars.lastLoginId = "";
                }
                GlobalVars.printLog("LoginPage","Login Count  : ",GlobalVars.loginCount);
                if(GlobalVars.getRemainingAttempts() > 0){
                    res.errorMessage = error.errorMsg + ". You have "+ GlobalVars.getRemainingAttempts() +" tries remaining";
                    res.errorTitle = GlobalVars.errorMessageTitle;
                    resolve(res);
                }else{
                    let requestParams = {};
                    let whereParams = {};
                    requestParams[GlobalVars.databaseTables.USER_DETAIL.IS_LOCKED] = "1";
                    requestParams[GlobalVars.databaseTables.USER_DETAIL.LOCK_DATE] = ""; 
                    whereParams[GlobalVars.databaseTables.USER_DETAIL.ID] = userId;
                    
                    JSONStoreService.updateUserDetail(JSONStoreService.collectionName,userId,"isLocked",true);
                    this.updateData(requestParams,whereParams,GlobalVars.USER_DETAIL_TABLE_NAME).then((result)=> {
                        GlobalVars.printLog("LoginPage","updateData response : ",result);
                        if(result.status == 200 && result.responseJSON.status == "success"){
                            res.errorMessage = GlobalVars.errorMessages.APP_LOCK;
                            res.errorTitle = GlobalVars.errorMessageTitle;
                            resolve(res);
                        }else{
                            res.errorMessage = GlobalVars.webServiceErrorMessage;
                            res.errorTitle = GlobalVars.errorMessageTitle;
                            resolve(res);
                        }
                    },(err)=>{
                        GlobalVars.printLog("LoginPage","updateData error : ",err);
                        res.errorMessage = GlobalVars.webServiceErrorMessage;
                        res.errorTitle = GlobalVars.errorMessageTitle;
                        resolve(res);
                    });
                }
            } else if(typeof error.errorMsg != 'undefined'){
                res.errorMessage = error.errorMsg;
                res.errorTitle = GlobalVars.errorMessageTitle;
                GlobalVars.loginCount = 0;
                resolve(res);
            } else{
                res.errorMessage = "Try again";
                res.errorTitle = GlobalVars.webServiceErrorMessage;
                GlobalVars.loginCount = 0;
                resolve(res);
            }
        });
        return promise;
    }

    public static getCashPaymentPointDetails (pincode : any){
        GlobalVars.googleAnalyticsTrackEvents("Cash Payment Point Details","Get Cash Payment Point Details","Get Cash Payment Point Details");
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            let parameters = {
                "pincode": pincode,
            }
            MMFSLService.callAdapter("MFWebServiceAdapter","getCashPaymentPointDetails","POST",parameters).then((response)=>{
                resolve(response);
            },(error)=>{
                GlobalVars.printLog(GlobalService.name,"GlobalService error : ", error);
                reject(GlobalVars.webServiceErrorMessage);
            });
        });
        return promise;
    }

    public static checkPin(params : any){
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{


        MMFSLService.callAdapter("DatabaseServiceAdapter","checkPin","POST",params).then((response)=>{
            resolve(response);
        },(error)=>{
            GlobalVars.printLog(GlobalService.name,"GlobalService CHECK Pin error : ", error);
            reject(GlobalVars.webServiceErrorMessage);
        });



    });

    return promise;


    }
}