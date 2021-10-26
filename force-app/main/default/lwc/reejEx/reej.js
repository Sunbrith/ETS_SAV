import { LightningElement, api, track, wire } from "lwc";
import GetStaffingImputations from "@salesforce/apex/CRA_Controller.GetStaffingImputations";
import SaveImputations from "@salesforce/apex/CRA_Controller.SaveImputations";

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LayoutItem extends LightningElement {
  OldStaffings = [];
  isLoading = false;
  @api datesend;
  @api daysend;
  @track StaffingsDisplay;
  StaffingsNotDisplay = [];
  StaffingsBackUp = [];
  StaffingsNotDisplayBackUp = [];
  @track error;
  SaveMessage = null;
  ImputationsMod = [];
  SommeParJour = [];
  MessageParJour = [];
  TotalSomme = 0;
  oldValueToDisplay = [];

  //ajout de ligne
  buttonLabel1 = 'Ajouter une ligne';

  async connectedCallback() {
    await this.loadData(this.datesend, this.daysend);
  }

  @api async loadData(dates, days) {
    const PicklistReusable = this.template.querySelector("c-picklist-reusable");
    if (PicklistReusable) {
      PicklistReusable.refreshData();
    }
    this.datesend = dates;
    this.daysend = days;
    this.StaffingsDisplay = [];
    this.StaffingsNotDisplay = [];
    this.StaffingsBackUp = [];
    this.ImputationsBackUp = [];
    this.OldStaffings = [];
    this.ImputationsMod = [];
    this.SommeParJour = [];
    this.MessageParJour = [];
    this.oldValueToDisplay = [];
    this.TotalSomme = 0;
    this.isLoading = true;

    await GetStaffingImputations({ lstDates: this.datesend })
      .then(result => {
        this.error = undefined;
        this.processingData(result);
      })
      .catch(error => {
        this.error = error;
        console.log(this.error);
        this.isLoading = false;
      });
  }

  processingData(result) {
    var mapResult = JSON.parse(result);
    this.StaffingsDisplay = this.staffingTreatment(mapResult);
    this.OldStaffings = this.StaffingsDisplay;
    this.TotalSommeFunction();

    this.setIsExposed();
    this.isLoading = false;
    this.StaffingsNotDisplay = this.StaffingsDisplay.filter(e => !e.isExposed);
    this.StaffingsBackUp = this.StaffingsDisplay.filter(e => !e.isExposed);
    this.StaffingsDisplay = this.StaffingsDisplay.filter(e => e.isExposed);
  }

  ligneSomme() {
    for (let i = 0; i < this.StaffingsDisplay.length; i++) {
      var SOMME = 0;
      for (
        let numeroJour = 0;
        numeroJour < this.datesend.length;
        numeroJour++
      ) {
        SOMME += parseFloat(
          this.StaffingsDisplay[i].inputationValues[numeroJour].value.CRA_TimeSpent__c
        );
      }
      this.StaffingsDisplay[i].sommeStaffing = SOMME;
    }
  }

  colonneSomme() {
    var somme = 0;
    var mapDateSomme = [];
    var mapDateMessage = [];
    for (let NumJour = 0; NumJour < this.datesend.length; NumJour++) {
      var Jour = {};
      Jour.sommeJour = 0;

      for (let i = 0; i < this.StaffingsDisplay.length; i++) {
        Jour.sommeJour += parseFloat(
          this.StaffingsDisplay[i].inputationValues[NumJour].value.CRA_TimeSpent__c
        );
      }


      if (Jour.sommeJour == 1 || Jour.sommeJour == 0) {
        Jour.message = false;
      } else {
        Jour.message = true;
      }
      mapDateSomme.push({ value: Jour, key: this.datesend[NumJour] });

      somme += Jour.sommeJour;
    }

    this.SommeParJour = mapDateSomme;
    this.MessageParJour = mapDateMessage;
    return somme;
  }

  TotalSommeFunction() {
    this.ligneSomme();
    this.TotalSomme = this.colonneSomme();
    this.checkIfCanHide();
    this.ImputationsMod = this.ModifiedImputations();
  }

  @api isModified() {
    if (this.ImputationsMod.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  @api setNoModifiedAPI() {
    this.ImputationsMod = [];
    return true;
  }

  staffingTreatment(mapResult) {
    try {
      var mapImputation = [];
      for (let i = 0; i < mapResult.length; i++) {
        var mapData = [];
        var sommeStaffing = 0;
        for (var key in mapResult[i].inputationValues) {
          mapResult[i].inputationValues[key].isWaiting = false;
          mapResult[i].inputationValues[key].isFreeze = false;
          mapResult[i].inputationValues[key].class_css = '';
          if (mapResult[i].inputationValues[key].CRA_Status__c == 'Validé') {
            mapResult[i].inputationValues[key].isFreeze = true;
            mapResult[i].inputationValues[key].isWaiting = false;
          } else if (mapResult[i].inputationValues[key].CRA_TimeSpent__c != '0') {
            mapResult[i].inputationValues[key].isWaiting = true;
          }

          mapData.push({ value: mapResult[i].inputationValues[key], key: key });
          sommeStaffing += parseFloat(
            mapResult[i].inputationValues[key].CRA_TimeSpent__c
          );
          mapImputation.push(mapResult[i].inputationValues[key]);
        }
        mapResult[i].inputationValues = mapData.slice(0).reverse();
      }
      this.ImputationsBackUp = JSON.parse(JSON.stringify(mapImputation));
    } catch (error1) {
      console.log(error1);
    }
    return mapResult;
  }

  passToParent(event) {
    var sommeJour = 0;
    //2021-08-24
    for (let i = 0; i < this.datesend.length; i++) {
      if (event.detail.imputdate == this.datesend[i]) {
        var numeroJour = i;
        break;
      }
    }

    for (let i = 0; i < this.StaffingsDisplay.length; i++) {
      if (this.StaffingsDisplay[i].id == event.detail.imputstaffing) {
        var OldValue = this.StaffingsDisplay[i].inputationValues[numeroJour].value
          .CRA_TimeSpent__c;
        var NewValue = event.detail.value;
        sommeJour =
          this.SommeParJour[numeroJour].value +
          (parseFloat(NewValue) - parseFloat(OldValue)); //sommejour + (newImp - oldImp)        

        this.StaffingsDisplay[i].inputationValues[numeroJour].value.CRA_TimeSpent__c = event.detail.value;

        if (this.StaffingsDisplay[i].inputationValues[numeroJour].value.CRA_TimeSpent__c == '0') {
          this.StaffingsDisplay[i].inputationValues[numeroJour].value.isWaiting = false;
        } else {
          this.StaffingsDisplay[i].inputationValues[numeroJour].value.isWaiting = true;
        }
      }
    }
    this.TotalSommeFunction();
    var staff = this.StaffingsDisplay.find(e => e.id == event.detail.imputstaffing);
    if (!staff.isExposed && staff.sommeStaffing > 0) {
      this.StaffingsNotDisplay = this.StaffingsNotDisplay.filter(e => e.id != event.detail.imputstaffing);
    }
  }

  checkIfCanHide() {
    for (let i = 0; i < this.StaffingsDisplay.length; i++) {
      this.StaffingsDisplay[i].cantHide = false;
      if (this.StaffingsDisplay[i].sommeStaffing > 0) {
        this.StaffingsDisplay[i].cantHide = true;
      }

    }
  }

  setIsExposed() {
    for (let i = 0; i < this.StaffingsDisplay.length; i++) {
      if (this.StaffingsDisplay[i].sommeStaffing > 0) {
        this.StaffingsDisplay[i].isExposed = true;
      }
    }
  }

  ModifiedImputations() {
    //const mapStaffingsToUp = new map();
    var lstNewStaffing = [];
    for (let i = 0; i < this.StaffingsDisplay.length; i++) {
      var staffing = this.StaffingsDisplay[i];
      for (let num = 0; num < this.datesend.length; num++) {
        var newValue = staffing.inputationValues[num].value;
        var oldValue = this.ImputationsBackUp.find(e => e.CRA_Staffing__c === newValue.CRA_Staffing__c && e.CRA_Date__c === newValue.CRA_Date__c);
        if (newValue.CRA_TimeSpent__c != oldValue.CRA_TimeSpent__c) {
          this.StaffingsDisplay[i].cantHide = true;
          lstNewStaffing.push(this.StaffingsDisplay[i].inputationValues[num].value);
        }
      }
    }
    return lstNewStaffing;
  }

  @api async getStaffings() {
    return this.StaffingsDisplay;
  }

  @api async handleSaveStaffing() {
    var DontSave = false;

    for (let i = 0; i < this.SommeParJour.length; i++) {
      if (this.SommeParJour[i].value.message == true) {
        DontSave = true;
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Erreur dans les imputations',
            message: 'Vous ne pouvez pas sauvegarder car la somme des imputations par jour est plus élevée que 1.',
            variant: 'error'
          })
        );
        break;
      }
    }
    if (!DontSave) {
      this.isLoading = true;
      this.SaveMessage = null;
      this.ImputationsMod = this.ModifiedImputations();

      await SaveImputations({ newImputations: this.ImputationsMod, lstDates: this.datesend })
        .then(result => {
          this.error = undefined;
          this.processingData(result);

          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Imputation soumise au chef de projet pour validation',
              variant: 'success'
            })
          );
        })
        .catch(error => {
          this.error = error;
          this.isLoading = false;
          this.dispatchEvent(
            new ShowToastEvent({
              title: 'Error creating record',
              message: error.body.message,
              variant: 'error'
            })
          );
          console.log(this.error);
        });
    }
    return DontSave;
  }

  pickToParent(event) {
    for (let i = 0; i < this.StaffingsDisplay.length; i++) {
      if (this.StaffingsDisplay[i].id == event.detail.id) {

        this.StaffingsDisplay[i].isExposed = event.detail.value;
        break;
      }
      this.TotalSommeFunction();
    }
  }

  async setNoModified() {
    const isNoMod = await this.setNoModifiedAPI();
    return isNoMod;
  }

  handleSelected(event) {
    this.oldValueToDisplay.forEach(element => {
      if (!event.detail.includes(element)) {
        var index = this.StaffingsDisplay.findIndex(e => e.id == element);
        this.StaffingsDisplay.splice(index, 1);
      }
    });
    event.detail.forEach(element => {
      if (typeof this.StaffingsDisplay.find(e => e.id == element) === 'undefined') {
        var row = this.StaffingsNotDisplay.filter(e => e.id == element);
        this.StaffingsDisplay = this.StaffingsDisplay.concat(row);
      }
    });
    this.oldValueToDisplay = event.detail;
  }

}