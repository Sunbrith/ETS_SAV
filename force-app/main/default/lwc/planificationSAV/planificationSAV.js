import { LightningElement, wire, track } from 'lwc';
import getInterventions from '@salesforce/apex/InterventionController.getInterventions';
import getDailyInterventions from '@salesforce/apex/DailyInterventionController.getDailyInterventions';
import getAppareilForAccount from '@salesforce/apex/InterventionController.getAppareilForAccount';
import { NavigationMixin } from 'lightning/navigation';
import getTodaysDate from '@salesforce/apex/DateController.getTodaysDate';

const COLUMNS = [
    { label: 'Code', fieldName: 'APCode__c', type: 'text' },
    { label: 'Nom', fieldName: 'Name', type: 'text' },
    { label: 'Details', fieldName: 'Type__c', type: 'text' }
]; 

var interventionIdExemple = 'a019E00000CsXRZQA3';
export default class planificationSAV extends NavigationMixin(LightningElement){

todaysDate;
rowCount;
nrAppareils;
intervention;
lstAppareil;
columns = COLUMNS;

@track
dailyInterventions;

@wire(getTodaysDate)
result(res) {
    if(res.data){
        this.todaysDate = res.data; 
        console.log(res.data);
    }
}


@wire(getDailyInterventions)
result(res){
    if(res.data){
        this.dailyInterventions = res.data;
        this.rowCount = this.dailyInterventions.length;
        console.log(res.data);
    }
}

    @wire(getInterventions, {interventionId : interventionIdExemple})
    interventions({data, error}){
        console.log(data);
        if(data){
            let tmp = JSON.parse(JSON.stringify(data));
            tmp.customerCode = tmp.Account__r.CustomerCode__c;
            this.intervention = tmp;
            console.log(this.intervention);

            getAppareilForAccount({accountId : this.intervention.Account__c})
            .then(result => {
                this.lstAppareil = result;
                this.nrAppareils = this.lstAppareil.length; 
                console.log(this.lstAppareil);
            })
            .catch(error => {
                console.log(error);
            });
        }else if(error){
            console.log(error);
            this.intervention = undefined;
        }
    };

    navigateToAccount(){
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.intervention.Account__c,
                objectApiName: 'Account',
                actionName: 'view'
            },
        });
    }

}