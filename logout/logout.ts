import { Directive, ElementRef, Renderer } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';

@Directive({
	selector: '[logout]' // Attribute selector
})
export class LogoutDirective {


	constructor(private _elementRef: ElementRef, private renderer: Renderer, public alertCtrl: AlertController) {
		this.renderer.listen(this._elementRef.nativeElement, 'click', (event) => {
			this.performLogout();
		});
	}

	performLogout() {
		GlobalVars.logout();
	}

}
