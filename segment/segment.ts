import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { GlobalVars } from '../../app/globalvars';
import { GlobalService } from '../../app/globalService';
import { Commons } from '../../app/framework';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { DatePipe } from '@angular/common';
import { MFNotification } from '../../app/MFNotification';
import { User } from '../../app/user';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
	selector: 'page-segment',
	templateUrl: 'segment.html',
})
export class SegmentPage {
	selectedTabs: string = "accountDetails";
	accountData: any;
	index: number;
	repaymentData = [];
	lastTransactionDetails = [];
	pdfObj = null;
	selectedDay : any;
	private isReminderBox  = false;
	localNotifications : any;
	calendarNotifications : any;
	showScheduleOptions : boolean = true;

	constructor(public navCtrl: NavController, public navParams: NavParams,private file: File, private fileOpener: FileOpener,private datePipe: DatePipe) {
		this.accountData = this.navParams.get('accountData');
		console.log("Account data : ", this.accountData);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SegmentPage');
	}

	ionViewDidEnter() {
		GlobalVars.googleAnalyticsTrackView(SegmentPage.name);
		GlobalService.getLastPaymentDetails(this.accountData.account_number).then((res)=>{
			console.log("getLastPaymentDetails response : ",res);
			if(res.responseJSON.StatusCode == 200){
				if(res.responseJSON.Get_Last_5_Tran_Dtls.Status == "SUCCESS"){
					this.lastTransactionDetails = res.responseJSON.Get_Last_5_Tran_Dtls.data;
				}
			}
		},(err)=>{
			console.log("getLastPaymentDetails error : ",err);
			//Commons.hideLoadingMask();
			//GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
		});
		this.localNotifications = User.getLoggedInUser().getExtraDetails().localNotifications;
		if(typeof this.localNotifications != 'undefined' && this.localNotifications.length != 0)
			this.findAndDeleteNotification();
	}
	showCofirm() {
		GlobalVars.showAlert(GlobalVars.translateText("Out Standing EMI Amount"),GlobalVars.translateText("*Outstanding EMI Amount - Doesn’t include the default charge &amp; other charges. Please contact our branch for complete details."));
	}

	toggleGroup(index) {
		console.log("index : " + index);
		if(index != this.index)
			this.index = index;
		else
			this.index = 0;
	}
	
	showCalendar() {
		console.log("calenndar");
		this.isReminderBox = !this.isReminderBox;
	}
	
	getRepaymentSchedule(){
		Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
		GlobalService.getRepaymentScheduleDetails(this.accountData.account_number).then((res)=>{
			console.log("getRepaymentScheduleDetails response : ",res);
			Commons.hideLoadingMask();
			if(res.responseJSON.StatusCode == 200){
				if(res.responseJSON.Repayment_Schedule.Status == "SUCCESS"){
					this.repaymentData = res.responseJSON.Repayment_Schedule.data;
					this.repaymentData = this.repaymentData.sort((a, b) => parseInt(a.Instalment_No) - parseInt(b.Instalment_No));
					this.generatePDF();
				}else{
					GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
				}
			}else {
				GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.REPAYMENT_SCHEDULE_DATA_NOT_FOUND);
			}
		},(err)=>{
			console.log("getRepaymentScheduleDetails error : ",err);
			Commons.hideLoadingMask();
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.webServiceErrorMessage);
		});
	}

	generatePDF(){
		console.log("in generate PDF");
		var date = this.datePipe.transform(new Date(),'dd MMM yyyy');
		var ac = [
			[{ text: 'Installment No.', bold: true }, { text: 'Due Date', bold: true }, { text: 'Installment Amount (in Rs)', bold: true }],
		];
		this.repaymentData.forEach((ele)=>{
			var data =[];
			data.push({'text': ele.Instalment_No,alignment : 'right'});
			data.push({'text': this.datePipe.transform (ele.Due_Date,'dd MMM yyyy'),alignment : 'right'});
			data.push({'text': ele.Instalment_Amount,alignment : 'right'});
			ac.push(data);
		});
			/* [{ text: 'value1' }, { text: 'value2' }, { text: 'valu3' }], */
		var dd = {
			pageSize: 'A4',
			pageMargins: [40, 70, 40, 130],
			header: {
				width: 350, image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANEAAAAPCAYAAAB6DiqwAAAACXBIWXMAAAsSAAALEgHS3X78AAAFDElEQVRoge1aS27bSBDtDLKXTzD07AVYWQy3tk8wvkGUE1gBCXA50pIAiTA3kE8QzQlG3mpFITqAeIJINwhKqRYKpeqfRNKGkQcYlkh29a9e9aui3n3/8++xUupatYPtsFnNW7KlNlEM4xrTa8NmNe2rfQfjb3V9QpGk2cl6CNgppRZ4WT+7LYv8MO4kzU7Wryzyk2usr2VZ5EvhGe57x37Yc3dKqTt22WSTjmVeFvmW3BsppUYGf6/R5o706YP6PU701rOBE5songyb1aglczDZf9m1EBJc2v5S8P6fYWN77J9DWg8JV+BQ5Fk67pP2SZpJzs/7OnF4pVSllBowWwvtyAR3Qr+m4M/73CZpdoWBweXneyBPWeQ1+okPL+7/8HgoFDebKHZFu994WwgOTEmaPXACIR48TUR4kvmg8iTE4Jy5vA9t4Im25GHb+PpKx/USeC6L3ChZPOXMHh3v4NCSFLOAkmUNwRc/jx2n9Z6Qb+p5stO+PpdFXtGbSZrB90f8Ks37XpKOGhKJ7ofN6tgA5JlS6gt75sOwWdV4f4THphRVtA0Y2ARlggtLV96CYzJFrGrYrBbs2hoX/EjuTRQbF8XHLs576piTdb6bKK5Qo1v7xfWtPIMT5AAgqbkk6gIwJi2ffB1ag+7fmPjQLeRTNJdhmOPzIeTVvrnnBELMCYmMfmyCz0lU8wuaQPozOoOotdHZ/g8Y0+0mio0FAJSKnNS8vQ4E4Egz3CBYqAg3Xp2RBx7tbqL4yhU4EP+RCMvnAeP56Gi/xn6WJjvSOJFsvonxJYA56H33Po2YlGsgB4FciKzHA9knjh1z+qkhj9J90SB14svqV2EE+p+duw5dybkD0NnOSaRtDmBaXN5+iQR/CCSx0y6eHi4CPeNY/zHcdxFojxF3EkAgDZ8AcWWRbKKzccBpkaTZE5lLZXNoAnoKLch/bWfs2GcqvyJcI5N68VE/YoWRYGxaK2jXKYkQE8d9TTTfY5TLuJHpZMISs6t/jc/MeYx2DXgiAWOHBA45DdZsrDVIMjiVDZUtirEHKTluLMHlPsDOlPQ9cDi0Bt3Dw5qVRb5I0kznOzc2SSeQdwJ5jQd5z4VtbbslETpBTZyjxuNY4TuTwyKhRPvmaZM71BLJ8ig8fh1AzprZXuIp5hPV18NmdWlFciLMTctlWz65gL43URxKolZgcmiTbUnK0bl4SjrlS14oCCRpdulU18RvT9CHnDPqeYyyM49I60IfSbQNnfXvkTtJLyJ9wE8+itqj4EExRacfEIc27akk5eh3L0mH5J2RnMxKXhcwd9KBisvZSWh1rk2MGIH2wgBNVZjf+AVOoGf23St/EbCzOUZI9EaHpsWliWVclESPSZpJCkK5JB2iwr4oeW2wBYYF5lcqUM52TiKOsVB+VoG5w2vENZy6PZSVvw6blW+O1ze4Q5/IW8sLVhOskg5yIIG8EvR7qIFETDyFInIpKDD1TaJvKOHeGmADfvQwt8dNFJsi94tCcGipKklPoSdD5ZYWdFxVOiWQV0JNFJEup1MiUcLvcS7UjLE6B7K1bxK9Fbx0DvZaQR1aAiVRxYoKGkv8EemxSmebq0BeCXNWhLDlmBKxrUWbLn47dwRWm5667AOxxVxB/7WVZ9WSXXzZPGP3fP7OyV8+YS756oElZlFSYSQ3VeU4gBR6PZ1SH9/xNJb74Id/4c++wCZfT5B78GL8U1nkYXJZKfUTSxEuSl/Nbc4AAAAASUVORK5CYII=', margin: [30, 30, 10, 20],
			},
			content: [
				{ text: 'Date - ' + date, alignment: 'right', margin: [0, 30, 0, 10] },
				{ style: 'titleText', decoration: 'underline', text: 'Loan Repayment Schedule for Agreement No : ' + this.accountData.account_number, margin: [0, 0, 0, 20], alignment: 'center' },
				{
					columns: [
						{ width: '*', text: '' },
						{
							width : 'auto',
							table: {
								// headers are automatically repeated if the table spans over multiple pages
								// you can declare how many rows should be treated as headers
								headerRows: 1,
								widths: [100, 100, 150],
								body: ac
							},
							tableAlignment: "center",
						},
						{ width: '*', text: '' },
					]
				}
			],
			footer: {
				columns: [
					{ margin: [50, 50, 0, 0], text: '2nd Floor Sadhana House, Worli, Pandurang Budhkar Marg, Mumbai – 400018 | www.mahindrafinance.com', alignment: 'left', style: 'footerText' },
					{ width: 400, image: 'data:image/jpeg;base64,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' }
				]
			},
			styles: {
				footerText: {
					fontSize: 8
				},
				titleText: {
					fontSize: 15
				}
			}
		}

		console.log("in generate PDF dd : ",dd);
		this.pdfObj = pdfMake.createPdf(dd);
		this.downloadPdf();
	}

	downloadPdf() {
		let fileName = this.accountData.account_number + "_Repayment_schedule.pdf"
		this.pdfObj.getBuffer((buffer) => {
			var blob = new Blob([buffer], { type: 'application/pdf' });

			// Save the PDF to the data Directory of our App
			this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true }).then(fileEntry => {
				// Open the PDf with the correct OS tools
				this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf');
			},(err) => {
				console.log("File open error : ",err);
			});
		}); 
	}
	hideReminderBox(){
		this.isReminderBox = !this.isReminderBox;
	}
	
	setReminder(){
		console.log("in set Reminder");
		console.log("Localnotifications : ",this.localNotifications);

		if(typeof this.selectedDay != 'undefined' && this.selectedDay != ''){
			if(this.accountData.next_emi_due_Date == ""){
				GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.informationMessages.NO_NEXT_EMI_DATE);
			}else if(this.accountData.emis_remaining == "" || this.accountData.emis_remaining == "0"){
				GlobalVars.showAlert(GlobalVars.informationMessageTitle,GlobalVars.informationMessages.NO_EMIs_REMAINING);
			}else{
				Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
				this.setNotification().then(()=>{
					Commons.hideLoadingMask();
					this.findAndDeleteNotification();
					GlobalVars.showAlert(GlobalVars.successMessageTitle,GlobalVars.successMessages.EVENT_CREATED);
				});
			}
		}else{
			GlobalVars.showAlert(GlobalVars.errorMessageTitle,GlobalVars.errorMessages.REPAYMENT_SCHEDULE_DATE_NOT_SELECTED);
		}
	}

	findAndDeleteNotification(){
		let promise: Promise<any>= new Promise( ( resolve, reject )=>{ 
			let eventStartDate = new Date(this.localNotifications[0].min_start_date);
			let eventEndDate = new Date(this.localNotifications[0].max_end_date);
			
			MFNotification.findEvent(this.localNotifications[0].event_title,"",this.localNotifications[0].event_message,eventStartDate,eventEndDate).then((res)=>{
				console.log("Response from findAndDeleteNotification : ",res);
				this.calendarNotifications = res;
				if(this.calendarNotifications !== undefined && this.calendarNotifications.length != 0){
					this.showScheduleOptions = false;
				}else{
					this.showScheduleOptions = true;
				}
			},(err)=>{
				console.log("error from findAndDeleteNotification : ",err);
				resolve();
			});
		});
		return promise;
	}

	deleteNotifications(res) {
		Commons.showLoadingMask(GlobalVars.loadingMaskMessage);
		let allPromise : Promise<any>[] =[] ;
		for(let element of this.calendarNotifications){
			if(element.title == this.localNotifications[0].event_title || element.message == this.localNotifications[0].event_message){
				console.log("element deleted : ",element);
				allPromise.push(MFNotification.deleteEvent(element.id));
			}
		};
		Promise.all(allPromise).then(()=>{
			console.log("All promise resolve");
			this.showScheduleOptions = true;
			this.localNotifications.forEach(element => {
				let notifications = [];
            	for(var i=1;i<=element.no_of_emi;i++){
					notifications.push(parseInt(element.account_number.toString() + (i).toString()));
				}
				MFNotification.cancelLocalNotifications(notifications);
			});
			Commons.hideLoadingMask();
		});
	}
	closeReminderBox() {
		this.isReminderBox = false;
	}
	setNotification (flag : boolean = true){
		let promise: Promise<any>= new Promise( ( resolve, reject )=>{ 
			let actualEMIDate = new Date(this.accountData.next_emi_due_Date.split(" ")[0]);
			let eventStartDate = new Date(actualEMIDate);
			eventStartDate.setDate(actualEMIDate.getDate() - parseInt(this.selectedDay));
			eventStartDate.setHours(0);
			eventStartDate.setMinutes(0);

			let recurrenceEndDate = new Date(eventStartDate);
			recurrenceEndDate.setMonth(eventStartDate.getMonth() + parseInt(this.accountData.emis_remaining) -1);
			
			let eventEndDate = new Date(eventStartDate);
			eventEndDate.setHours(23);
			eventEndDate.setMinutes(59);

			let eventTitle = "EMI of Account number : "+ this.accountData.account_number;
			let eventlocation = "";
			let eventMessage = "EMI payment of Rs."+ this.accountData.emi_amount  +" due for Account number "+ this.accountData.account_number +".";

			console.log("Actual EMI Date : ",actualEMIDate);
			console.log("Remindar Date : ",eventStartDate);
			console.log("Recurrence end Date : ",recurrenceEndDate);

			let calenderOptions = MFNotification.calendar.getCalendarOptions();
			calenderOptions["calendarId"]= MFNotification.calendarId ;
			calenderOptions["calendarName"] = MFNotification.calendarName;
			calenderOptions["firstReminderMinutes"] = 120;
			calenderOptions["secondReminderMinutes"] = 30;
			calenderOptions["recurrence"] = "monthly";
			//calenderOptions.recurrenceCount = parseInt(this.accountData.emis_remaining);
			calenderOptions["recurrenceEndDate"] = recurrenceEndDate;

			MFNotification.createEventWithOptions(eventTitle,eventlocation,eventMessage,eventStartDate,eventEndDate,calenderOptions).then((res)=>{
				console.log("createEventwithoptions res : ",res);
				let caledarEventId = res;
				MFNotification.scheduleNotification(eventStartDate,this.accountData.emis_remaining,this.accountData.account_number,this.accountData.user_id,eventMessage).then(()=>{
					let requestparams = {};
					let minStartDate = new Date(actualEMIDate);
					minStartDate.setDate(actualEMIDate.getDate() - 10);
					minStartDate.setHours(0);
					minStartDate.setMinutes(0);

					let maxEndDate = new Date(actualEMIDate);
					maxEndDate.setDate(actualEMIDate.getDate() - 2);
					maxEndDate.setHours(23);
					maxEndDate.setMinutes(59);
					
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.USER_ID] = User.getLoggedInUser().getUserId();
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.ACCOUNT_NUMBER] = this.accountData.account_number;
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.NO_OF_EMI] = parseInt(this.accountData.emis_remaining);
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.TITLE] = eventTitle;
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.MESSAGE] = eventMessage;
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.START_DATE] = this.datePipe.transform (eventStartDate,"yyyy-MM-dd hh:mm:ss");
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.END_DATE] = this.datePipe.transform (eventEndDate,"yyyy-MM-dd hh:mm:ss");
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.RECURRENCE] = "monthly";
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.RECURRENCE_END_DATE] = this.datePipe.transform (recurrenceEndDate,"yyyy-MM-dd hh:mm:ss");
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.MIN_START_DATE] =
					this.datePipe.transform (minStartDate,"yyyy-MM-dd hh:mm:ss");
					requestparams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.MAX_END_DATE] =
					this.datePipe.transform (maxEndDate,"yyyy-MM-dd hh:mm:ss");

					let whereParams = {};
					whereParams[GlobalVars.databaseTables.LOCAL_NOTIFICATION.USER_ID]=User.getLoggedInUser().getUserId();
					

					GlobalService.saveAndRetriveLocalNotification(requestparams,whereParams,GlobalVars.LOCAL_NOTIFICATION_TABLE_NAME).then((res)=>{
						console.log("saveLocalNotification success : " , res);
						if(res.status == 200){
							if(res.responseJSON.status == "success"){
								this.localNotifications = res.responseJSON.data;
								let userDetails = User.getLoggedInUser().getExtraDetails();
								userDetails['localNotifications'] = res.responseJSON.data;
								User.getLoggedInUser().setExtraDetails(userDetails);
								resolve();
							}
						}
					},(err)=>{
						console.log("saveLocalNotification error : " , err);
						reject();
					});
				});
			},(err)=>{
				console.log("createEventwithoptions err : ",err);
				reject();
			});
		});
		return promise;
	}
}