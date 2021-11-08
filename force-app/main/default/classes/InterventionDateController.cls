/*
    @description       : This controller is used to fetch the start date of interventions and is displayed in in the main UI table
    @author            : 04/11/2021 by SANDERSEN
    @last modified on  : 04/11/2021
    @last modified by  : SANDERSEN
*/



public with sharing class InterventionDateController {

    @AuraEnabled(cacheable=true)
    public static List<Intervention__c> getInterventionStartDate(Id interventionId){
        return [
                SELECT Id, StartDate__c
                FROM Intervention__c 
                WHERE StartDate__c = TODAY
                WITH SECURITY_ENFORCED];
    }
}