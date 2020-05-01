import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { User } from '../app/user';

/*
  Generated class for the IonicUtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IonicUtil {

  private applicationVersion: any;
  public mfConfigData: any;

  constructor(
    public http: HttpClient,
    private platform:Platform
  ) {
    console.log('Hello IonicUtilProvider Provider');
  }

  onPinChange( self, event: any, focusElementID: string,length : number = 4) {
		
		//console.log(event.target.value);
    let eleValue = event.value != undefined ? event.value : event.target.value;  
    if(eleValue.length == length){
      
      this.moveCaret(window,-4);
			const element = self.elementRef.nativeElement.querySelector(focusElementID);
			// we need to delay our call in order to work with ionic ...
      // element.setSelectionRange(1, 1);
      element.focus();
      /* setTimeout(() => {
			 	this.renderer.invokeElementMethod(element, actionEvent, []);
			 }, 0); */
		}

  }
  
  clearInputField(event: any) {

    let eleValue = event.value != undefined ? event.value : event.target.value; 
		if( eleValue && eleValue.length == 4){
			event.value = "";
		}
	}

  getApplicationVersion() {

    return this.applicationVersion;
  }

  hasParameter(param) {
    return param != undefined && param != null ? param : "";
  }

  printPrettyJSON(obj: any){
    console.log(JSON.stringify(obj, null, 4));
  } 
  
  setMFConfigData(){
    let mfConfig = User.getLoggedInUser().getExtraDetails().mfConfig;

    if(mfConfig){
      console.log("catching config data...");
      for(let config in mfConfig){
        console.log(JSON.stringify(config));
        this.mfConfigData[config['property_name']] = config['property_value']; 
      }
    }

  }

  getMFPConfigData(): any{
    return this.mfConfigData;
  }

  moveCaret(win, charCount) {
    var sel, range;
    if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var textNode = sel.focusNode;
            var newOffset = sel.focusOffset + charCount;
            sel.collapse(textNode, Math.min(textNode.length, newOffset));
        }
    } else if ( (sel = win.document.selection) ) {
        if (sel.type != "Control") {
            range = sel.createRange();
            range.move("character", charCount);
            range.select();
        }
    }
  }
}
