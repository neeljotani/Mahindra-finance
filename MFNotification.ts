import { Calendar } from '@ionic-native/calendar';
import { LocalNotifications } from '@ionic-native/local-notifications';

declare var cordova;

export class MFNotification {
    
    static calendar : Calendar;
    static calendarId : any;
    static calendarName : string;
    static localNotification : LocalNotifications;
    static initialize(calendar: Calendar,localNotification : LocalNotifications) {
        MFNotification.calendar = calendar;
        MFNotification.localNotification = localNotification;
        MFNotification.configurePush();
    }

    static configurePush() {
        this.checkPermission().then(()=>{
            let calendarFound = false;
            MFNotification.calendar.listCalendars().then((res)=>{
                console.log("all calendars : ",res);
                if(typeof res != 'undefined' && res.length != 0){
                    res.forEach(element => {
                        if(element.name == "MahindraCalendar"){
                            calendarFound = true;
                            this.calendarId = element.id;
                            this.calendarName = element.name;
                        }
                    });
                    if(!calendarFound){
                        var calOptions = MFNotification.calendar.getCalendarOptions();
                        calOptions.calendarName = "MahindraCalendar";
                        this.createCalender(calOptions).then((res)=>{
                            if(typeof res != 'undefined'){
                                this.calendarId = res;
                                this.calendarName = "MahindraCalendar";
                            }
                        });
                    }
                }else{
                    var calOptions = MFNotification.calendar.getCalendarOptions();
                    calOptions.calendarName = "MahindraCalendar";
                    this.createCalender(calOptions).then((res)=>{
                        if(typeof res != 'undefined'){
                            this.calendarId = res;
                            this.calendarName = "MahindraCalendar";
                        }
                    });
                }
            })
        });
        // this.createCalender().then(() => {
        //     this.checkPermission().then(() => {
        //         //this.initPush();
        //         this.createCalender();
        //     });
        // });
        this.getAllScheduleNotifications();
    }
    private static createCalender(calOptions) {
        let promise: Promise<any> = new Promise((resolve, reject) => {
            MFNotification.calendar.createCalendar(calOptions).then((msg) => {
                console.log("Calender Success : ", msg);
                resolve(msg);
            }, (err) => {
                console.log("Calender Failure : ", err);
                reject(err);
            });
           
        });
        return promise;
    }
    private static checkPermission() {
        let promise: Promise<any> = new Promise((resolve, reject) => {
            MFNotification.calendar.hasReadWritePermission().then(() => {
                //LocalNotification.createEventWithOptions();
            }, (error) => {
                MFNotification.calendar.requestReadWritePermission().then((data) => {
                    console.log("Request permission ", data);
                }, (err) => {
                    console.log("error permission", err);
                });
            });
            resolve();
        });
        return promise;
    }  

    static createEventWithInterOptions(title,location,notes,eventStartDate,endDate,calenderOptions){
        let promise: Promise<any> = new Promise((resolve, reject) => {
        
            console.log("calender options : ",calenderOptions);
            MFNotification.calendar.createEventInteractivelyWithOptions(title, location,notes, eventStartDate, endDate , calenderOptions).then((data)=>{
                console.log("calendar created success : ",data);
                resolve(data);
            },(err)=>{
                console.log("calendar created error : ",err);
                reject(err);
            });
        });
        return promise;
        // MFNotification.calendar.createEventWithOptions(title, location,notes, startDate, endDate , calenderOptions).then((data) => {
        //     console.log("event created wiht options: ", data);
        // }, (error) => {
        //     console.log("Error with options: ", error);
        // });
    }

    static createEventWithOptions(title,location,notes,eventStartDate,endDate,calenderOptions){
        let promise: Promise<any> = new Promise((resolve, reject) => {
        
            console.log("calender options : ",calenderOptions);
            window['plugins'].calendar.createEventWithOptions(title, location,notes, eventStartDate, endDate , calenderOptions,(data)=>{
                console.log("calendar created success : ",data);
                resolve(data);
            },(err)=>{
                console.log("calendar created error : ",err);
                reject(err);
            });
        });
        return promise;
        // MFNotification.calendar.createEventWithOptions(title, location,notes, startDate, endDate , calenderOptions).then((data) => {
        //     console.log("event created wiht options: ", data);
        // }, (error) => {
        //     console.log("Error with options: ", error);
        // });
    }
    //static deleteEvent(id,title,location,notes,startDate,endDate){
    static deleteEvent(id){
        let promise: Promise<any> = new Promise((resolve, reject) => {
            // MFNotification.calendar.deleteEvent(title,location,notes,startDate,endDate).then((res)=>{
            //     console.log("delete calendar event success : ",res);
            //     resolve(res);
            // },err => {
            //     console.log("delete calendar event error : ",err);
            //     reject(err);
            // });
            
            // MFNotification.calendar.deleteEventById(id,null).then((data)=>{
            //     console.log("delete event success : ",data);
            //     resolve(data);
            // },(err)=>{
            //     console.log("delete event err",err);
            //     resolve(err);
            // });

            window['plugins'].calendar.deleteEventById(id,"",(data)=>{
                console.log("delete event success : ",data);
                resolve(data);
            },(err)=>{
                console.log("delete event err",err);
                resolve(err);
            });
        });
        return promise;
    }

    static findEvent(title,location,notes,startDate,endDate){
        let promise: Promise<any> = new Promise((resolve, reject) => {
            let options = MFNotification.calendar.getCalendarOptions();
            options.calendarId = this.calendarId;
            options.calendarName = this.calendarName;
            MFNotification.calendar.findEventWithOptions(title,location,notes, startDate, endDate,options).then((res)=>{
            //window['plugins'].calendar.findEvent(title,location,notes,startDate,endDate,(res)=>{
                console.log("findEvent success: ", res);
                resolve(res);
            },(err)=>{
                console.log("findEvent error: ", err);
                reject(err);
            });
        });
        return promise;
    }

    static scheduleNotification (date,noOfEMI,accountNumber,mobileNo,message) {
        let promise: Promise<any> = new Promise((resolve, reject) => {
            date = new Date(date);
            let notifications = [];
            for(var i=1;i<=noOfEMI;i++){
                notifications.push({
                    //id: parseInt(accountNumber.toString() + (i).toString() + mobileNo.toString()),
                    id: parseInt(accountNumber.toString() + (i).toString()),
                    text: message,
                    trigger: {at: new Date(date.getFullYear(),(date.getMonth() + i),date.getDate())},
                    led: 'FF0000',
                    icon: "res://icon.png",
                    smallIcon:"res://icon.png"
                });
            }
            console.log("notfication : ",notifications);
            this.localNotification.schedule(notifications);
            resolve();
        });
        return promise;
    }

    static cancelLocalNotifications (id : any) {
        this.localNotification.cancel(id).then((res)=>{
            console.log("localnotification cancel : " ,res);
        },err => {
            console.log("localnotification cancel : " ,err);
        }); 
    }

    private static getAllScheduleNotifications (){
        this.localNotification.getAll().then((res)=>{
            console.log("localnotification get all success",res);
        },(err)=>{
            console.log("localnotification get all error",err);
        });
    }
    private static cancelAll (){
        this.localNotification.cancelAll().then((res)=>{
            console.log("localnotification cancel all success",res);
        },(err)=>{
            console.log("localnotification cancel all error",err);
        });
    }
}