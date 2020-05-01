type adapterName = "MFWebServiceAdapter" | "Common" | "DatabaseServiceAdapter";
type methodType = "GET" | "POST" ;

export class MMFSLService {
    public static mfwebservice_Adapter_Path="/adapters/MFWebServiceAdapter/";
    public static common_Adapter_Path="/adapters/Common/";
    public static databaseservice_Adapter_Path="/adapters/DatabaseServiceAdapter/";

    
    public static callAdapter (adapterName : adapterName, methodName : string , methodType : methodType , parameter: {}){
        let adapterPath : string;
        if(adapterName == "MFWebServiceAdapter")
            adapterPath = MMFSLService.mfwebservice_Adapter_Path + methodName ;
        else if(adapterName == "Common")
            adapterPath = MMFSLService.common_Adapter_Path + methodName;
        else if(adapterName == "DatabaseServiceAdapter")
            adapterPath =  MMFSLService.databaseservice_Adapter_Path + methodName;
            
        let promise: Promise<any>= new Promise( ( resolve, reject )=>{
            var resourceRequest = new WLResourceRequest(adapterPath,methodType == "POST" ? WLResourceRequest.POST : WLResourceRequest.GET);
            
            for (let key in parameter){
                resourceRequest.setQueryParameter(key,parameter[key]);
            }
            resourceRequest.send().then((response) => {
                resolve(response);
            },(error)=>{
                reject(error);
            });
        });
        return promise;
    }
}