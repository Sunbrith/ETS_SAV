public with sharing class PlanificationController {

    @AuraEnabled(cacheable=true)

        public static List<Account> getAccountInfo(Id accountId) {

            return [
                SELECT Id, CustomerCode__c, Phone, BillingAddress
                FROM   Account
                WHERE  AccountId = :accountId
                WITH   SECURITY_ENFORCED
            ];
        }
    }
