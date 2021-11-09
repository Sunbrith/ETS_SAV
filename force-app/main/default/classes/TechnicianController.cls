public with sharing class TechnicianController {
    @AuraEnabled(cacheable=true)

    public static List<Wrapper> getTechnicians(){
        List<User> technicians = [SELECT Id, Alias 
         FROM User
         WITH SECURITY_ENFORCED];

List<Wrapper> response = new List<Wrapper>();
        for(User technician: technicians){
            Wrapper wrapper = new Wrapper();
            wrapper.id = technician.Id;
            wrapper.alias = technician.Alias;
            response.add(wrapper);
        }
        return response;
    }

    public class Wrapper{
        @AuraEnabled
        public String id{get;set;}
        
        @AuraEnabled
        public String alias{get;set;}
    }
}
