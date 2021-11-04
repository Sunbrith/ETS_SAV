import { LightningElement, wire} from 'lwc';
import getInterventions from '@salesforce/apex/InterventionController.getInterventions';
import getAppareilForAccount from '@salesforce/apex/InterventionController.getAppareilForAccount';

const COLUMNS = [
    { label: 'Code', fieldName: 'APCode__c', type: 'text' },
    { label: 'Nom', fieldName: 'Name', type: 'text' },
    { label: 'Details', fieldName: 'Type__c', type: 'text' }
]; 

var intreventionIdExemple = 'a019E00000CsXRZQA3';
export default class InterventionList extends LightningElement {

intervention;
lstAppareil;
columns = COLUMNS;

    @wire(getInterventions, {interventionId : intreventionIdExemple})
    interventions({data, error}){
        if(data){
            let tmp = JSON.parse(JSON.stringify(data));
            tmp.customerCode = tmp.Account__r.CustomerCode__c;
            this.intervention = tmp;
            console.log(this.intervention);

            getAppareilForAccount({accountId : this.intervention.Account__c})
            .then(result => {
                this.lstAppareil = result;
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
}