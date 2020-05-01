import { GlobalVars } from "./globalvars";

export class JSONStoreService {
    public static collectionName : string = "userDetail";

    public static jsonCollection : any = {
        userDetail : {
            searchFields : { id : 'string' },
            password : "mahindraFinance"
        }
    }

    public static initJSON(collectionName : string) : Promise <any>{
        let promise : Promise<any> = new Promise((resolve,reject) =>{
            WL.JSONStore.init(this.jsonCollection).then((collections) => {
                console.log("collections : ",collections);
                resolve();
            }).fail((error) => {
                console.log("collections error : ",error);
                reject();
            });
        });
        return promise;
    }
    public static addtoJSON(collectionName : string,data) {
        this.removeCollection(collectionName).then(()=>{
            this.initJSON(collectionName).then(()=>{
                WL.JSONStore.get(collectionName).add(data, {}).then((success) => {
                    // handle success
                    GlobalVars.printLog(JSONStoreService.name,"add to JSON success : ",success);
                }).fail((error)=> {
                    // handle failure
                    GlobalVars.printLog(JSONStoreService.name,"add to JSON error : ",error);
                });
            });
        });
    }

    public static removeCollection(collectionName : string) : Promise<any> {
        let promise : Promise<any> = new Promise ((resolve,reject) =>{
            WL.JSONStore.get(collectionName).removeCollection().then((removeCollectionReturnCode)=> {
                // handle success
                GlobalVars.printLog(JSONStoreService.name,"collection removed successfully",removeCollectionReturnCode);
                resolve();
            }).fail((error) => {
                // handle failure
                GlobalVars.printLog(JSONStoreService.name,"collection removed failure" ,error);
                reject();
            });
        });
        return promise; 
    }

    public static getDataFromJSON (collectionName : string) : Promise<any>{
        let promise : Promise<any> = new Promise ((resolve,reject) =>{
            WL.JSONStore.get(collectionName).findAll().then((dataFromCollection)=> {
                // handle success
                GlobalVars.printLog(JSONStoreService.name,"getDataFromJSON successfully",dataFromCollection);
                resolve(dataFromCollection[0].json);
            }).fail((error) => {
                // handle failure
                GlobalVars.printLog(JSONStoreService.name,"getDataFromJSON failure" ,error);
                reject();
            });
        });
        return promise;
    }

    public static updateUserDetail (collectionName : string,userId : string,key : string,value:any){
        let query = {id: userId};
        let options = {
            exact: true,
            limit: 10
        };
        WL.JSONStore.get(collectionName).find(query,options).then((dataFromCollection)=> {
            GlobalVars.printLog(JSONStoreService.name,"updateLockStatus find data",dataFromCollection);
            if(dataFromCollection.length != 0){
                let data = dataFromCollection[0];
                data.json[key] = value;
                WL.JSONStore.get(collectionName).replace(data, options).then((numberOfDocsReplaced) => {
                    GlobalVars.printLog(JSONStoreService.name,"updateLockStatus replace successfully",numberOfDocsReplaced);
                }).fail((error)=> {
                    GlobalVars.printLog(JSONStoreService.name,"updateLockStatus replace error",error);
                });
            }
        }).fail((error) => {
            GlobalVars.printLog(JSONStoreService.name,"updateLockStatus failure" ,error);
        });
    }

    public static updateJSONdetails(collectionName : string,userId : string,value : any){
        let query = {id: userId};
        let options = {
            exact: true,
            limit: 10
        };
        WL.JSONStore.get(collectionName).find(query,options).then((dataFromCollection)=> {
            GlobalVars.printLog(JSONStoreService.name,"updateJSONdetails find data",dataFromCollection);
            let data = dataFromCollection[0];
            data.json.extraDetails = value;
            WL.JSONStore.get(collectionName).replace(data, options).then((numberOfDocsReplaced) => {
                this.getDataFromJSON(collectionName);
                GlobalVars.printLog(JSONStoreService.name,"updateJSONdetails replace successfully",numberOfDocsReplaced);
            }).fail((error)=> {
                GlobalVars.printLog(JSONStoreService.name,"updateJSONdetails replace error",error);
            });
        }).fail((error) => {
            GlobalVars.printLog(JSONStoreService.name,"updateJSONdetails failure" ,error);
        });
    }
}