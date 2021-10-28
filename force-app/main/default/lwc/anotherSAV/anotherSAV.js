import { LightningElement, wire } from 'lwc';
import CustomerCode__c from '@salesforce/schema/Account__r.CustomerCode__c';
import NAME from '@salesforce/schema/Intervention__C.Name';
import InterventionDescription__c from '@salesforce/schema/Intervention__C.InterventionDescription__C';
import getInterventions from '@salesforce/apex/InterventionController.getInterventions';

const COLUMNS = [
    { label: 'Code', fieldName: CustomerCode__c.fieldApiName, type: 'text' },
    { label: 'Nom', fieldName: NAME.fieldApiName, type: 'text' },
    { label: 'Details', fieldName: InterventionDescription__c.fieldApiName, type: 'text' }
]; 

export default class ContactList extends LightningElement {
columns = COLUMNS;
    @wire(getInterventions)
    interventions; 
}