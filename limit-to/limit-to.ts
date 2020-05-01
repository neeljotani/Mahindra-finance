import { Directive, EventEmitter, Input, NgZone, Output } from '@angular/core';

@Directive({
	selector: '[limit-to]',
	host: {
		'(keyup)': '_onKeypress($event)',
	}
})
export class LimitToDirective {
	@Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
	@Input('limit-to') limitTo;
	constructor(private _ngZone: NgZone) {

	}
	_onKeypress(e) {
		const limit = +this.limitTo;
		if (e.target.value.length === limit) {
			e.preventDefault();
		} else if (e.target.value.length > limit) {
			e.target.value = e.target.value.toString().slice(0, limit);
			this._ngZone.run(() => {
				this.ngModelChange.emit(e.target.value);
			});
		}
	}
}