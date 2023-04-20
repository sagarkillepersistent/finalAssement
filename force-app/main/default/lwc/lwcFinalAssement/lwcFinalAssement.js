import { LightningElement,api} from 'lwc';
import getObjfields from '@salesforce/apex/ApexClass.getObjfields';
import getQueryResult from '@salesforce/apex/ApexClass.getQueryResult';
import { NavigationMixin } from 'lightning/navigation';

export default class LwcFinalAssement extends NavigationMixin(LightningElement) {
    finalQuery;
    selectedPickValues=[];
    fieldsOptions=[];
    showQuery=false;
    sdhoDatatable = false;
    displayQueryData;
    @api recordId;
    @api objectName;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    datatableHandler(){
        this.sdhoDatatable =! this.sdhoDatatable;
    }
    connectedCallback(){
        getObjfields({sObjName:this.objectName}).then(result=>{
            // console.log(result)
             const tempField=result;
             for (let key in tempField) {
                if (Object.prototype.hasOwnProperty.call(tempField, key)) {
                  this.fieldsOptions = [...this.fieldsOptions,{ label: key, value: tempField[key]}];
                  console.log(this.fieldsOptions)
                }
              }
            //  for(let key in tempField){
            //      this.fieldsOptions=[...this.fieldsOptions,{label:key,value:tempField[key]}];
            //     // console.log(this.fieldsOptions)
            //  }
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

       this.finalQuery=`Select ${this.selectedPickValues} from ${this.objectName} WHERE AccountId='${this.recordId}'`;
       
       let arrs=JSON.parse(JSON.stringify(this.selectedPickValues));
        console.log(arrs);
   
    this.columns1=arrs;
    this.columns1.forEach(ele=>{
               this.columns=[...this.columns,{label:ele,fieldName:ele,sortable: true}];
    });
       console.log(this.columns);
       this.columns.push({
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'Edit', name: 'edit' },
                { label: 'New', name: 'new' },
            ],
        },
    });
    }

    clickHandler(){
        this.sdhoDatatable =! this.sdhoDatatable;
        console.log(this.finalQuery);

        getQueryResult({querySring:this.finalQuery}).then(result=>{
            this.displayQueryData=result;
            this.displayQueryData.forEach(element => {
                console.log(element);
            });

        }).catch(error=>{
            console.error(error);
        });
    } 
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'edit':
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: row.Id,
                        objectApiName: this.objectName,
                        actionName: 'edit'
                    }
                });
                break;
            case 'new':
                this[NavigationMixin.Navigate]({            
                    type: 'standard__objectPage',
                    attributes: {
                        objectApiName: this.objectName,
                        actionName: 'new'               
                    }
                });
                break;
            default:
                break;
        }
    }
    createNew(){
        this[NavigationMixin.Navigate]({            
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectName,
                actionName: 'new'               
            }
        });  
    }
    handleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.displayQueryData];

        cloneData.sort(this.sortData(sortedBy, sortDirection));

        this.displayQueryData = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    sortData(fieldName, sortDirection) {
        const sortOrder = sortDirection === 'asc' ? 1 : -1;
        return (a, b) => {
            if (a[fieldName] < b[fieldName]) {
                return -1 * sortOrder;
            } else if (a[fieldName] > b[fieldName]) {
                return 1 * sortOrder;
            }
            return 0;
        };
    }
}