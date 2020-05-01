import {LoadingController, Loading} from 'ionic-angular';
import { GlobalVars } from './globalvars';
interface authConfig {
	securityCheck: string;
}

export class AppConfig {
	public static packagePrefix: string = "mahindra finance";

	public static auth: authConfig = {
		securityCheck: "MahindraLogin"
	};

	public static loggerConfig: any = {
		pretty: true,
		stacktrace: false,
		level: 'INFO',
		tag: {
			level: true,
			pkg: true
		},
		filters: {},
		autoSendLogs: true,
		capture: true,
		maxFileSize: 2048000	//~2 MB
	};

	public static loadingConfig: any = {
		content: 'Please Wait...'
	};
}

export class Commons {
	private static loadingController: LoadingController = null;
	private static loading: Loading = null;
	private static isLoadingMaskPresented: boolean = false;

	static initialize( loadController: LoadingController ): void {
		Commons.loadingController = loadController;
		//Setting our own configuration.
		WL.Logger.config(AppConfig.loggerConfig);

		//updating configuration from server.
		WL.Logger.updateConfigFromServer().then( (logResponse) => {});
	}

	static getLogger(packegeName: string): any {
		return WL.Logger.create({ pkg: AppConfig.packagePrefix + packegeName.toLowerCase() });
	}

	static showLoadingMask( loadingText: string ): Promise<any> {
		loadingText = GlobalVars.translateText(loadingText);
		let loaderText = loadingText;
		if(Commons.isLoadingMaskPresented){
			return  new Promise(function (resolve, reject) {
				resolve(loaderText);
			});
		}
		if ( loaderText && loaderText.trim().length == 0 ) {
			loaderText = GlobalVars.translateText(AppConfig.loadingConfig.content);
		}
		if( Commons.loadingController ) {
			Commons.loading = Commons.loadingController.create({
				content: loadingText
			});

  		Commons.isLoadingMaskPresented = true;
			return Commons.loading.present();
		}
	}
	static hideLoadingMask(): Promise<any>  {
		if (Commons.isLoadingMaskPresented) {
			Commons.isLoadingMaskPresented = false;
			return Commons.loading.dismiss();
		}
	}
}

export class Deferred<T> {
	private promise: Promise<T>;
	resolve: (value?: T | PromiseLike<T>) => void;
	reject: (reason?: any) => void;
	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	getPromise(): Promise<T> {
		return this.promise;
	}
}