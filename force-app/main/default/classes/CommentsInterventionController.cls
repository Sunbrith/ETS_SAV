public with sharing class CommentsInterventionController {
    @AuraEnabled(cacheable=true)

    public static List<Intervention__c> getComments(){
        return [ SELECT Commentaires__c FROM Intervention__c WITH SECURITY_ENFORCED
        ];
    }
}
