// this class interacts with the main (html) table to retrieve information about the daily interventions

import { LightningElement, wire, track } from 'lwc';
import getDailyInterventions from '@salesforce/apex/DailyInterventionController.getDailyInterventions';

export default class ClientInterventionList extends LightningElement {

@track
dailyInterventions;

@wire(getDailyInterventions)
result(res){
    if(res.data){
        this.dailyInterventions = res.data;
        console.log(res.data);
    }
}

}