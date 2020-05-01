import { NgModule } from '@angular/core';
import { LimitToDirective } from './limit-to/limit-to';
import { LogoutDirective } from './logout/logout';
@NgModule({
	declarations: [LimitToDirective,
    LogoutDirective],
	imports: [],
	exports: [LimitToDirective,
    LogoutDirective]
})
export class DirectivesModule {}
