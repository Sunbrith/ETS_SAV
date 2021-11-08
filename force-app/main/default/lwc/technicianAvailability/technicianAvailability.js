import { LightningElement, wire, track } from 'lwc';
import getTechnicians from '@salesforce/apex/TechnicianController.getTechnicians';


export default class TechnicianAvailability extends LightningElement {

	@track
	technicians; 

	@wire(getTechnicians)
	result(res){
		if(res.data){
			this.technicians = res.data;
			console.log(res.data);
		}
	}

}