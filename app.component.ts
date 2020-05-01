import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform, AlertController, LoadingController, App, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { LanguageScreenPage } from '../pages/language-screen/language-screen';
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage';
import { GlobalVars } from './globalvars';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Commons, AppConfig } from './framework';
import { PreLoginPage } from '../pages/pre-login/pre-login';
import { Network } from '@ionic-native/network';
import { User } from './user';
import { UserLogin } from './mobilefirst/UserLogin';
import { JSONStoreService } from './jsonStoreService';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';

import { Calendar } from '@ionic-native/calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MFNotification } from './MFNotification';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	
	@ViewChild(Nav) nav : Nav;
	rootPage: any;
	public static challengeHandler : any;
	constructor(platform: Platform, statusBar: StatusBar, nativeStorage: NativeStorage, splashScreen: SplashScreen, translate: TranslateService, alertCtrl: AlertController, loadingCtrl: LoadingController, public appCtrl: App,private network: Network,renderer : Renderer,googleAnalytics: GoogleAnalytics,nativeGeocoder: NativeGeocoder,public geoLocation : Geolocation,calendar : Calendar,localNotifications: LocalNotifications) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();
			nativeStorage.getItem('appLanguage').then((data) => {
				console.log("appLanguage : ", data);
				translate.setDefaultLang(data);
			}, (err) => {
				console.log("appLanguage :  error ", err);
				translate.setDefaultLang('en');
			});

			GlobalVars.isOnline =  this.network.type === 'none' ? false : true;

			this.network.onConnect().subscribe(() => {
				console.log("Online");
				GlobalVars.isOnline = true;
			});
	
			this.network.onDisconnect().subscribe(() => {
				console.log("offline");
				GlobalVars.isOnline = false;
			});
			MyApp.challengeHandler = new UserLogin(AppConfig.auth.securityCheck);
			Commons.initialize(loadingCtrl);
			GlobalVars.initialize(alertCtrl, translate, appCtrl,googleAnalytics,geoLocation,nativeGeocoder);
			MFNotification.initialize(calendar,localNotifications);

			renderer.listenGlobal('document', 'mfpjsonjsloaded', () => {
				JSONStoreService.initJSON(JSONStoreService.jsonCollection);
			});
			
			nativeStorage.getItem('alreadyVisited').then((data) => {
				console.log("alreadyVisited : ", data);
				this.rootPage = PreLoginPage;
			}, (err) => {
				console.log("alreadyVisited : error", err);
				this.rootPage = LanguageScreenPage;
			});

			platform.pause.subscribe(x => {
				nativeStorage.setItem("Mahindra_sessionTimeout", new Date().getTime());
			});
			GlobalVars.startTrackerWithId();
			platform.registerBackButtonAction(() => {
				if (GlobalVars.isAlertShow) {
					GlobalVars.hideAlert();
					return;
				}
				appCtrl.getActiveNavs()[0].getActive().dismiss({},"",GlobalVars.navPopOptions).then(x => {
					Commons.hideLoadingMask();
					GlobalVars.printLog(MyApp.name,"In success",null);
				}, (error) => {
					if ((User.getLoggedInUser() != null) && (appCtrl.getActiveNavs()[0].canGoBack() == false)) {
						Commons.hideLoadingMask();
						GlobalVars.logout();
						GlobalVars.printLog(MyApp.name,"In if",null);
					} else if (appCtrl.getActiveNavs()[0].canGoBack() == true) {
						Commons.hideLoadingMask();
						appCtrl.getActiveNavs()[0].pop();
						GlobalVars.printLog(MyApp.name,"In 2nd else",null);
					}
					/* if ((User.getLoggedInUser() != null) && (appCtrl.getActiveNavs()[0].getActive().component == DashboardPage || appCtrl.getActiveNavs()[0].getActive().component == DashboardTabPage || appCtrl.getActiveNavs()[0].getActive().component == MyAccountListPage)) {
						Commons.hideLoadingMask();
						GlobalVars.logout();
						GlobalVars.printLog(MyApp.name,"In if",null);
					} else if(User.getLoggedInUser() != null && appCtrl.getActiveNavs()[0].canGoBack() == true){
						Commons.hideLoadingMask();
						appCtrl.getActiveNavs()[0].pop(GlobalVars.navPopOptions);
						GlobalVars.printLog(MyApp.name,"In 2nd else",null);
					} */ /* else if(User.getLoggedInUser() != null){
						appCtrl.getRootNavs()[0].goToRoot();
					}  *//* else if (appCtrl.getActiveNavs()[0].canGoBack() == true) {
						Commons.hideLoadingMask();
						appCtrl.getActiveNavs()[0].pop(GlobalVars.navPopOptions);
						GlobalVars.printLog(MyApp.name,"In 2nd else",null);
					} else if (this.nav.canGoBack() == true){
						Commons.hideLoadingMask();
						this.nav.pop(GlobalVars.navPopOptions);
						GlobalVars.printLog(MyApp.name,"In 3rd else",null);
					}  */else {
						GlobalVars.printLog(MyApp.name,"In else",null);
						let buttons = [{
							text: GlobalVars.translateText("No"),
							role: 'cancel',
							handler: () => { }
						},{
							text: GlobalVars.translateText("Yes"),
							handler: () => {
								console.log("MahindraApp.challengeHandler", MyApp.challengeHandler );
								console.log("MahindraApp.challengeHandler.isChallenged", MyApp.challengeHandler.isChallenged() );
								if ( MyApp.challengeHandler ) {
									if (MyApp.challengeHandler.isChallenged())
										MyApp.challengeHandler.getChallengeHandler().cancel();
								}
								platform.exitApp();
							}
						}];
						GlobalVars.showAlert("Exit the App","Are you sure you want to exit the app?",buttons);
					}
				});
			}, 0);
		});
	}
}

