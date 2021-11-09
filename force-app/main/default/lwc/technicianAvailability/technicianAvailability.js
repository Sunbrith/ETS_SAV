import { LightningElement, wire } from 'lwc';
import getTechnicians from '@salesforce/apex/TechnicianController.getTechnicians';

const COLUMNS = [
    { label: '+TEC: ', fieldName: 'Alias', type: 'text' },
    { label: '-TEC: ', fieldName: 'Alias', type: 'text' },
    { label: '+CHA: ', fieldName: 'Alias', type: 'text' },
	{ label: 'Absent(s): ', fieldName: 'Alias', type: 'text' }
]; 

export default class TechnicianAvailability extends LightningElement {

	technicians;
	columns = COLUMNS;

	@wire(getTechnicians)
	result(res){
		if(res.data){
			this.technicians = res.data;
			console.log(res.data);
		}
	}
}