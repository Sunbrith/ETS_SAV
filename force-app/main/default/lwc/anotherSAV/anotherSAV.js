import { LightningElement, wire } from 'lwc';
import getInterventions from '@salesforce/apex/InterventionController.getInterventions';

const COLUMNS = [
    { label: 'Code', fieldName: 'customerCode', type: 'text' },
    { label: 'Nom', fieldName: 'name', type: 'text' },
    { label: 'Details', fieldName: 'interventionDescription', type: 'text' }
]; 

export default class ContactList extends LightningElement {
data;
columns = COLUMNS;
    @wire(getInterventions)
    interventions(res){
        if(res.data){
            console.log(res.data);
            this.data = res.data;
        }
    }; 
}