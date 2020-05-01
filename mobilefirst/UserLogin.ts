import { Commons, Deferred } from '../framework';

export class UserLogin {
	logger: any;

	private securityCheckName: string;
	private _isChallenged: boolean;
	private userLoginCH: any;
	private loginDeferred: Deferred<any>;

	constructor(securityCheckName: string){
		this.logger = Commons.getLogger(UserLogin.name);

		this.securityCheckName = securityCheckName;
		this._isChallenged = false;
		this.userLoginCH = WL.Client.createSecurityCheckChallengeHandler(this.securityCheckName);
		this.initializeChallengeHandler();
	}

	private initializeChallengeHandler(): void {
		this.userLoginCH.securityCheckName = this.securityCheckName;

		this.userLoginCH.handleChallenge = (challenge): void => {
			this._isChallenged = true;
			this.logger.info("error challenge: "+challenge.errorMsg+"...remianing attempts: "+challenge.remainingAttempts);
			this.loginDeferred.reject(challenge);
		};

		this.userLoginCH.handleSuccess = (data): void => {
			this._isChallenged = false;
			this.logger.info("authenticated user: "+JSON.stringify(data.user));
			this.loginDeferred.resolve(data);
		};

		this.userLoginCH.handleFailure = (error): void => {
			this._isChallenged = false;
			this.logger.info("challenge failure: "+JSON.stringify(error));
			this.loginDeferred.reject(error);
		};
	}

	getChallengeHandler(): any {
		return this.userLoginCH;
	}

	isChallenged(): boolean {
		return this._isChallenged;
	}
	login(userId: string, pin : string = ""): Promise<any> {
		this.loginDeferred = new Deferred<any>();
		if(this._isChallenged) {
			this.userLoginCH.submitChallengeAnswer({"userId": userId, "pin": pin});
		} else {
			WLAuthorizationManager.login(this.userLoginCH.securityCheckName, {"userId": userId, "pin": pin})
				.then((data) => {
					this.logger.info("logged in");
					this.loginDeferred.resolve(data);
				}, (response) => {
					this._isChallenged = false;
					this.logger.info("login failed: "+JSON.stringify(response));
					this.loginDeferred.reject(response);
				});
		}
		return this.loginDeferred.getPromise();
	}

	logout(): void {
		WLAuthorizationManager.logout(this.userLoginCH.securityCheckName)
			.then(() => {
				this.logger.debug("logout success");
			}, (response) => {
				this.logger.debug("logout failed");
			});
	}

}