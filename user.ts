/**
 * Represents user properties
 */
export class UserBean {
	private userId: string;
	private pin: string;
	private isRegistered: boolean;
	private registrationDate: string;
	private lastLoginDate: string;
	private isOnlineLogin : boolean;
	private extraDetails : any;
	private isLocked : boolean;

	constructor( userId: string = "",pin: string = "",isRegistered : boolean = false,registrationDate: string = "", lastLoginDate: string = "",isOnlineLogin: boolean = false,extraDetails : any = null,isLocked : boolean = false){
		this.userId = userId;
		this.pin = pin;
		this.isRegistered = isRegistered;
		this.registrationDate = registrationDate;
		this.lastLoginDate=lastLoginDate;
		this.isOnlineLogin = isOnlineLogin;
		this.extraDetails = extraDetails;
		this.isLocked = isLocked;
	}
	/**
	 * Set and get user id of user
	 */
	setUserId( userId: string ): void {
		this.userId = userId;
	}

	getUserId(): string {
		return this.userId;
	}

	/**
	 * Set and get pin
	 */
	setPin( pin: string ): void {
		this.pin = pin;
	}

	getPin(): string{
		return this.pin;
	}

	setIsRegistered ( isRegistered : boolean): void {
		this.isRegistered = isRegistered;
	}

	getIsRegistered(): boolean {
		return this.isRegistered;
	}

	setRegistrationDate( registrationDate : string): void{
		this.registrationDate = registrationDate;
	}

	getRegistrationDate(): string{
		return this.registrationDate;
	}

	setLastLoginDate (lastLoginDate : string): void{
		this.lastLoginDate =lastLoginDate;
	}

	getLastLoginDate() : string{
		return this.lastLoginDate;
	}

	setIsOnlineLogin( isOnlineLogin : boolean) : void{
		this.isOnlineLogin = isOnlineLogin;
	}
	getIsOnlineLogin() : boolean{
		return this.isOnlineLogin;
	}

	setExtraDetails( extraDetails : any ) : void{
		this.extraDetails = extraDetails;
	}
	getExtraDetails () : any{
		return this.extraDetails;
	}

	setIsLocked ( isLocked : boolean) : void {
		this.isLocked = isLocked;
	}
	getIsLocked () : any {
		return this.isLocked;
	}
}

/**
 * This class use to work with logged in user
 */
export class User {
	private static loggedInUser: UserBean = null;
	private constructor() { }

	/**
	 * Set the logged in user object if not already set
	 */
	public static setLoggedInUser( loggedInUser: UserBean ): void {
		if ( User.loggedInUser == null ) {
			User.loggedInUser = loggedInUser;
		}
	}

	public static getLoggedInUser(): UserBean {
		return User.loggedInUser;
	}

	public static destroyUserObject() {
		User.loggedInUser = null;
	}
}