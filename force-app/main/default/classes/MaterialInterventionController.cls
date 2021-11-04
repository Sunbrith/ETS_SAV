public with sharing class MaterialInterventionController {
    @AuraEnabled(cacheable=true)

    public static List<Intervention__c> getMaterials(){
        return [SELECT Name FROM Intervention__r.Materiel_Fourni__c WITH SECURITY_ENFORCED];
    }
}