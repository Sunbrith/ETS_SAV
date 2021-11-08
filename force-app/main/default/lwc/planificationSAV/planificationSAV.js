import { LightningElement, wire, track } from 'lwc';
import getInterventions from '@salesforce/apex/InterventionController.getInterventions';
import getDailyInterventions from '@salesforce/apex/DailyInterventionController.getDailyInterventions';
import getAppareilForAccount from '@salesforce/apex/InterventionController.getAppareilForAccount';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    { label: 'Code', fieldName: 'APCode__c', type: 'text' },
    { label: 'Nom', fieldName: 'Name', type: 'text' },
    { label: 'Details', fieldName: 'Type__c', type: 'text' }
]; 

var interventionIdExemple = 'a019E00000CsXRZQA3';
export default class planificationSAV extends NavigationMixin(LightningElement){

nrAppareils;
intervention;
lstAppareil;
columns = COLUMNS;

@track
dailyInterventions;

@wire(getDailyInterventions)
result(res){
    if(res.data){
        this.dailyInterventions = res.data;
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



   // value = "fs";
   /*
   Original hardcode by JB
   @api
    tableData = [
        { CodeClient: "0003860", ClientNameAddress: "REGENT 6 RUE DE VERDUN", CpCity: "93110 ROSNY-SOUS-BOIS", Date: "22/09/21", Heure: "06:00", Type: "S.A.V G", Tech: "AA", Solde: "-3568.3" },
        { CodeClient: "0234512", ClientNameAddress: "REEJ 26 RUE ANATOLE FRANCE", CpCity: "92300 LEVALLOIS", Date: "22/09/21", Heure: "06:00", Type: "Ramonage", Tech: "JV", Solde: "100000" },
        { CodeClient: "5467312", ClientNameAddress: "THOMAS 4 RUE MICHELET", CpCity: "93100 MONTREUIL", Date: "22/09/21", Heure: "06:00", Type: "S.A.V G", Tech: "AL", Solde: "2356.67" },
        { CodeClient: "0098654", ClientNameAddress: "MOK 7 RUE DU TEMPLE", CpCity: "93300 NEUILLY SUR MARNE", Date: "22/09/21", Heure: "06:00", Type: "S.A.V G", Tech: "AA", Solde: "0" },
        { CodeClient: "0964512", ClientNameAddress: "HENRY 12 RUE PIERRE", CpCity: "93110 ROSNY-SOUS-BOIS", Date: "22/09/21", Heure: "06:00", Type: "S.A.V G", Tech: "AL", Solde: "3000" },
        { CodeClient: "0000123", ClientNameAddress: "BERNARD 78 RUE CHAPTAL", CpCity: "93110 ROSNY-SOUS-BOIS", Date: "22/09/21", Heure: "06:00", Type: "S.A.V G", Tech: "GD", Solde: "0" },
        { CodeClient: "0000001", ClientNameAddress: "GOMES 4 BD GALLIENI", CpCity: "94360 BRY SUR MARNE", Date: "22/09/21", Heure: "06:00", Type: "S.A.V G", Tech: "GD", Solde: "0" }
    ]; 


    @api
    columns = [{ label: "Client", type: "text", fieldName: "CodeClient", typeAttributes: {}, cellAttributes: {} }, { label: "Nom + adresse", type: "text", fieldName: "ClientNameAddress", typeAttributes: {}, cellAttributes: {} }, { typeAttributes: {}, cellAttributes: {}, label: "CP + Ville", type: "text", fieldName: "CpCity" }, { typeAttributes: {}, cellAttributes: {}, label: "Solde", type: "currency", fieldName: "Solde" }, { typeAttributes: {}, cellAttributes: {}, label: "Date", type: "text", fieldName: "Date" }, { typeAttributes: {}, cellAttributes: {}, label: "Heure", type: "text", fieldName: "Heure" }, { typeAttributes: {}, cellAttributes: {}, label: "Type", type: "text", fieldName: "Type" }, { typeAttributes: {}, cellAttributes: {}, label: "Qualification", type: "text", fieldName: "Qualification" }, { typeAttributes: {}, cellAttributes: {}, label: "Tech", type: "text", fieldName: "Tech", editable: true }, { typeAttributes: {}, cellAttributes: {}, label: "Description", type: "text", fieldName: "Description" }];
    @api
    options = [{ label: "Sales", value: "option1" }, { label: "Force", value: "option2" }];
    @api
    tableData1 = [{ name: "Arthur Song", createdBy: "John H." }];
    @api
    columns1 = [{ label: "Name", type: "text", fieldName: "name" }, { label: "Created By", type: "text", fieldName: "createdBy" }];
    
    
    
    @api
    tableData2 = [{ name: "Arthur Song", createdBy: "John H.", code: "CM", Name: "DD", details: "C 620 1146" }, { code: "P", Name: "SADMSON", details: "C1240 M X 2" }];
    @api
    columns2 = [{ label: "Code", type: "text", fieldName: "code", typeAttributes: {}, cellAttributes: {} }, { label: "Nom", type: "text", fieldName: "Name", typeAttributes: {}, cellAttributes: {} }, { typeAttributes: {}, cellAttributes: {}, label: "Details", type: "text", fieldName: "details" }];
    

    renderedCallback(){
        console.log('test');
    }
    */