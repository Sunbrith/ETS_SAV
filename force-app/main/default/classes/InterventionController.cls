/*
    @description       : This controller is used to fetch information on interventions
    @author            : 27/10/2021 by SANDERSEN
    @last modified on  : 03/11/2021
    @last modified by  : SANDERSEN
*/


public class InterventionController {

    @AuraEnabled(cacheable=true)
    public static Intervention__c getInterventions(Id interventionId) {
        return[
            SELECT Id, Commentaires__c, Account__c, Account__r.CustomerCode__c, Name, Account__r.Phone, Account__r.BillingStreet, Account__r.BillingPostalCode, Account__r.BillingCity, Account__r.BillingCountry, Account__r.AdditionalBillingAddress__c, InterventionDescription__c,
            (SELECT Id, Name FROM Materiels_Fournis__r) 
            FROM Intervention__c
            WHERE Id = :interventionId
        ];
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Appareil__c> getAppareilForAccount(Id accountId){
        return [SELECT Id, APCode__c, Name, Type__c FROM Appareil__c WHERE Compte__c = :accountId WITH SECURITY_ENFORCED];
    }
}