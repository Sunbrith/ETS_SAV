/*
    @description       : This controller is used to fetch information on interventions
    @author            : 27/10/2021 by SANDERSEN
    @last modified on  : 02/11/2021
    @last modified by  : SANDERSEN
*/


public with sharing class InterventionController {
    @AuraEnabled(cacheable=true)

    public static List<Wrapper> getInterventions() {
        List<Intervention__c> result = [
            SELECT Account__r.CustomerCode__c, Name, InterventionDescription__c
            FROM Intervention__c
            WITH SECURITY_ENFORCED
        ];
        List<Wrapper> wrapperList = new List<Wrapper>();
        for(Intervention__c intervention: result){
            Wrapper wrapper = new Wrapper();
            wrapper.customerCode = intervention.Account__r.CustomerCode__c;
            wrapper.name = intervention.name;
            wrapper.interventionDescription = intervention.InterventionDescription__c;
            wrapperList.add(wrapper);
        }
        return wrapperList;
    }

    public class Wrapper{
        @AuraEnabled
        public String customerCode {set;get;}
        @AuraEnabled
        public String name {set;get;}
        @AuraEnabled
        public String interventionDescription {set;get;}
    }
}
