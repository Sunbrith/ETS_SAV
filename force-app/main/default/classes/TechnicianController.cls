public with sharing class TechnicianController {
    @AuraEnabled(cacheable=true)

    public static List<Wrapper> getTechnicians(){
        List<User> technicians = [SELECT Id, Name, Alias 
         FROM User
         WITH SECURITY_ENFORCED];

List<Wrapper> response = new List<Wrapper>();
        for(User technician: tech){
            Wrapper wrapper = new Wrapper();
            wrapper.id = technician.Id;
            wrapper.Name = technician.Name;
            wrapper.nom = technician.Alias;
            response.add(wrapper);
        }
        return response;
    }

    public class Wrapper{
        @AuraEnabled
        public String id{get;set;}
        @AuraEnabled
        public String nom{get;set;}
        @AuraEnabled
        public String alias{get;set;}
    }
}