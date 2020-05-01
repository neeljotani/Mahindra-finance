import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { MyApp } from './app.component';
import { NativeStorage } from "@ionic-native/native-storage";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DirectivesModule } from '../directives/directives.module';

import { LanguageScreenPage } from '../pages/language-screen/language-screen';
import { RegistrationMobileNumberPage } from '../pages/registration/registration-mobile-number/registration-mobile-number';
import { OtpVerificationPage } from '../pages/registration/otp-verification/otp-verification';
import { SetPinPage } from '../pages/registration/set-pin/set-pin';
import { PreLoginPage } from '../pages/pre-login/pre-login';
import { LoginPage } from '../pages/login/login';
import { AppIntroductionPage } from '../pages/app-introduction/app-introduction';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { MyAccountListPage } from '../pages/my-account/my-account-list/my-account-list';
import { RepaymentDetailsPage } from '../pages/my-account/repayment-details/repayment-details';
import { ViewAccountTabPage } from '../pages/my-account/view-account-tab/view-account-tab';
import { AccountDetailsPage } from '../pages/my-account/account-details/account-details';
import { PayOnlineDetailPage } from '../pages/pay-online/pay-online-detail/pay-online-detail';
import { PayOnlineConfirmDetailPage } from '../pages/pay-online/pay-online-confirm-detail/pay-online-confirm-detail';
import { PayOnlinePaymentModePage } from '../pages/pay-online/pay-online-payment-mode/pay-online-payment-mode';
import { PreApprovedLoanOfferPage } from '../pages/pre-approved-loan/pre-approved-loan-offer/pre-approved-loan-offer';
import { DashboardTabPage } from '../pages/dashboard/dashboard-tab/dashboard-tab';
import { Timer } from '../providers/timer/timer';
import { MenuPage } from '../pages/menu/menu';
import { Network } from '@ionic-native/network';
import { ForgotPinPage } from '../pages/forgot-pin/forgot-pin';
import { CallExecutivePage } from '../pages/call-executive/call-executive';
import { CashPaymentPointPage } from '../pages/cash-payment-point/cash-payment-point';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { SegmentPage } from '../pages/segment/segment';
import { OffersDetailsPage } from '../pages/pre-approved-loan/offers-details/offers-details';

import { FixedDepositPage } from '../pages/fixed-deposit/fixed-deposit';
import { TransactionSuccessfulPage } from '../pages/transaction-successful/transaction-successful';
import { AddAccountPage } from '../pages/add-account/add-account';
import { SwiperModule } from 'angular2-useful-swiper';
import { TermsAndConditionsPage } from '../pages/terms-and-conditions/terms-and-conditions';
import { BranchLocatorPage } from '../pages/branch-locator/branch-locator';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { DatePipe } from '@angular/common';
import { Calendar } from '@ionic-native/calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { ReschedulePaymentPage } from '../pages/reschedule-payment/reschedule-payment';
import { ContactUsPage } from '../pages/contact-us/contact-us';
import { IonicUtil } from '../providers/ionic-util';

export function createTranslateLoader(http: HttpClient) {
	console.log("in createTranslateLoader");
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		MyApp,
		LanguageScreenPage,
		DashboardPage,
		DashboardTabPage,
		MyAccountListPage,
		RepaymentDetailsPage,
		ViewAccountTabPage,
		PayOnlineDetailPage,
		PayOnlineConfirmDetailPage,
		PayOnlinePaymentModePage,
		PreLoginPage,
		RegistrationMobileNumberPage,
		OtpVerificationPage,
		SetPinPage,
		LoginPage,
		AppIntroductionPage,
		AccountDetailsPage,
		PreApprovedLoanOfferPage,
		MenuPage,
		CallExecutivePage,
		CashPaymentPointPage,
		BranchLocatorPage,
		ForgotPinPage,
		ResetPasswordPage,
		SegmentPage,
		OffersDetailsPage,
		FixedDepositPage,
		TransactionSuccessfulPage,
		AddAccountPage,
		TermsAndConditionsPage,
		PrivacyPolicyPage,
		ReschedulePaymentPage,
    	ContactUsPage
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		DirectivesModule,
		IonicModule.forRoot(MyApp, {
			tabsHideOnSubPages: true,
		}),
		SwiperModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LanguageScreenPage,
		DashboardPage,
		DashboardTabPage,
		MyAccountListPage,
		RepaymentDetailsPage,
		ViewAccountTabPage,
		PayOnlineDetailPage,
		PayOnlineConfirmDetailPage,
		PayOnlinePaymentModePage,
		PreLoginPage,
		RegistrationMobileNumberPage,
		OtpVerificationPage,
		SetPinPage,
		LoginPage,
		AppIntroductionPage,
		AccountDetailsPage,
		PreApprovedLoanOfferPage,
		MenuPage,
		CallExecutivePage,
		CashPaymentPointPage,
		BranchLocatorPage,
		ForgotPinPage,
		ResetPasswordPage,
		SegmentPage,
		OffersDetailsPage,
		FixedDepositPage,
		TransactionSuccessfulPage,
		AddAccountPage,
		TermsAndConditionsPage,
		PrivacyPolicyPage,
		ReschedulePaymentPage,
    	ContactUsPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		NativeStorage,
		AndroidPermissions,
		Network,
		GoogleAnalytics,
		NativeGeocoder,
		Geolocation,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		Timer,
		File,
		FileOpener,
		DatePipe,
		Calendar,
		LocalNotifications,
		IonicUtil
	]
})
export class AppModule { }
