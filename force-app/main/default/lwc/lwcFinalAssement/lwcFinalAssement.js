iimport { LightningElement,api,wire } from 'lwc';
import getObjNames from '@salesforce/apex/ApexClass.getObjNames';
import getObjfields from '@salesforce/apex/ApexClass.getObjfields';
import getQueryResult from '@salesforce/apex/ApexClass.getQueryResult';
import { NavigationMixin } from 'lightning/navigation';


export default class LwcFinalAssement extends NavigationMixin(LightningElement) {
    finalQuery;
    selectedPickValues=[];
    fieldsOptions=[];
    showQuery=false;
    sdhoDatatable = false;


    objNameOptions=[];
    selectedObject;
    @api recordId;
    // @api objectName;
    condData='WHERE AccountId='+this.recordId;
    displayQueryData;

    @wire(getObjNames)
    objHandler({data,error}){
        if(data){
            const tempData=data;

            for(let key in tempData){
                this.objNameOptions=[...this.objNameOptions,{label:key,value:tempData[key]}];
            }
            console.log(this.recordId);
            this.objNameOptions=this.objNameOptions.sort((a,b)=>(a.label > b.label)? 1 :((b.label > a.label) ? -1 : 0));

        }
        // if(error){
        //     console.error(error);
        // }
    }
    datatableHandler(){
        this.sdhoDatatable =! this.sdhoDatatable;
    }

    objchangeHandler(event)
    {
        this.selectedObject=event.target.value;
       // alert(event.target.value)

        getObjfields({sObjName:this.selectedObject}).then(result=>{
           // console.log(result)
            const tempField=result;

            for(let key in tempField){
                this.fieldsOptions=[...this.fieldsOptions,{label:key,value:tempField[key]}];
               // console.log(this.fieldsOptions)
            }
        }).catch(error=>{
            console.error(error);
        });


    }

    columns=[];
    columns1=[];
    changeHandler(event)
    {
        this.columns=[];
        this.selectedPickValues=event.target.value;

        
       this.finalQuery=`Select ${this.selectedPickValues} from ${this.selectedObject} WHERE AccountId='${this.recordId}'`;
       this.showQuery=true;

       let arrs=JSON.parse(JSON.stringify(this.selectedPickValues));
        console.log(arrs);
   

    this.columns1=arrs;
    this.columns1.forEach(ele=>{
               this.columns=[...this.columns,{label:ele,fieldName:ele}];
    });

       console.log(this.columns);
     

    }

    // conditionHandler(event){
    //     this.condData=event.target.value;
    //     this.finalQuery=`Select ${this.selectedPickValues} from ${this.selectedObject} ${this.condData}`;

       
    // }

    
    clickHandler(){
        console.log(this.finalQuery);
        // this.columns = [ 
        //      { label: 'Id', fieldName: 'Id' }, 
        //        { label: 'Name', fieldName: 'Name'} 
        //      ]; 
        // this.finalQuery=`Select ${this.selectedPickValues} from ${this.selectedObject} ${this.condData}`;
        getQueryResult({querySring:this.finalQuery}).then(result=>{
          //  console.log(result);
            this.displayQueryData=result;
            this.displayQueryData.forEach(element => {
                console.log(element);
            });

        }).catch(error=>{
            console.error(error);
        });

      
    } 
    createNew(){
        this[NavigationMixin.Navigate]({            
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.selectedObject,
                actionName: 'new'               
            }
        });  
    }
    // handleRowAction( event ) {

    //     const actionName = event.detail.action.name;
    //     const row = event.detail.row;
    //     switch ( actionName ) {
    //         case 'New':
    //             this[NavigationMixin.Navigate]({            
    //                 type: 'standard__objectPage',
    //                 attributes: {
    //                     objectApiName: this.selectedObject,
    //                     actionName: 'new'               
    //                 }
    //             });
    //             break;
    //         case 'edit':
    //             this[NavigationMixin.Navigate]({
    //                 type: 'standard__recordPage',
    //                 attributes: {
    //                     recordId: row.Id,
    //                     objectApiName: this.selectedObject,
    //                     actionName: 'edit'
    //                 }
    //             });
    //             break;
    //         default:
    //     }

    //}
}