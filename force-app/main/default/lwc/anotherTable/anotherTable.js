import { LightningElement, wire } from 'lwc';
import getClientInterventions from '@salesforce/apex/ClientInterventionController.getClientInterventions';

const COLUMNS1 = [
    { label: 'Client', fieldName: 'customerCode', type: 'text' },
    { label: 'Nom', fieldName: 'name', type: 'text' },
    { label: 'CP', fieldName: 'shippingPostalCode', type: 'text' },
	{ label: 'Solde', fieldName: 'accountingBalance', type: 'text' },
	{ label: 'Date', fieldName: 'date', type: 'text' },
	//{ label: 'Heure', fieldName: 'time', type: 'text' },
	{ label: 'Type', fieldName: 'type', type: 'text' },
	{ label: 'Qualification', fieldName: 'interventionQualification', type: 'text' },
	{ label: 'Technicien', fieldName: 'interventionValidateTechnician', type: 'text' },
	{ label: 'Description', fieldName: 'interventionDescription', type: 'text' }
]; 

export default class ClientInterventionList extends LightningElement {
data;
columns = COLUMNS1;
    @wire(getClientInterventions)
    clientInterventions(res){
        if(res.data){
            console.log(res.data);
            this.data = res.data;
        }
    }; 
}