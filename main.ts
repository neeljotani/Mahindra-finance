import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

(<any>window).wlCommonInit = () => {
    platformBrowserDynamic().bootstrapModule(AppModule);
}
