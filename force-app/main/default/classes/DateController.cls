public with sharing class DateController {

    @AuraEnabled(cacheable=true)
    public static Date getTodaysDate() {
        return Date.today();

    }
}
