public with sharing class InterventionController {
    @AuraEnabled(cacheable=true)

    public static List<Intervention__c> getInterventions() {
        return [
            SELECT Account__r.CustomerCode__c, Name, InterventionDescription__c
            FROM Intervention__c
            WITH SECURITY_ENFORCED
        ];
    }
}
