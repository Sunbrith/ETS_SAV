/*
    @description       : This controller is used to fetch information on all client interventions display in in the main UI table
    @author            : 02/11/2021 by SANDERSEN
    @last modified on  : 02/11/2021
    @last modified by  : SANDERSEN
*/



public with sharing class ClientInterventionController {
    @AuraEnabled(cacheable=true)

    public static List<Wrapper> getClientInterventions() {
        List<Account> result = [
            SELECT Name, ShippingPostalCode, AccountingBalance__c, Date, Type, Intervention__c.Qualification__c, Intervention__c.ValidateTechnician__c, Intervention__c.Description_Intervention__c
            FROM Account
            WITH SECURITY_ENFORCED
        ];
        List<Wrapper> wrapperList = new List<Wrapper>();
        for(Account acc: result){
            Wrapper wrapper = new Wrapper();
            wrapper.name = acc.name;
            wrapper.shippingPostalCode = acc.shippingPostalCode;
            wrapper.accountingBalance__c = acc.accountingBalance__c;
            wrapper.date = acc.date; 
            wrapper.type = acc.type;
            wrapper.interventionQualification = acc.intervention__c.Qualification__c;
            wrapper.interventionValidateTechnician = Intervention__c.ValidateTechnician__c;
            wrapper.interventionDescription = acc.Intervention__c.Description_Intervention__c;
            wrapperList.add(wrapper);
        }
        return wrapperList;
    }

    public class Wrapper{
        @AuraEnabled
        public String name {set;get;}
        @AuraEnabled
        public String shippingPostalCode {set;get;}
        @AuraEnabled
        public String accountingBalance {set;get;}
        @AuraEnabled
        public String date {set;get;}
        @AuraEnabled
        public String type {set;get;}
        @AuraEnabled
        public String interventionQualification {set;get;}
        @AuraEnabled
        public String interventionValidateTechnician {set;get;}
        @AuraEnabled
        public String interventionDescription {set;get;}
    }
}
