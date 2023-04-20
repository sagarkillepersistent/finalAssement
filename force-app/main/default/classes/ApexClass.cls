public with sharing class ApexClass {
    @AuraEnabled(cacheable=true)
    public static Map<String,String> getObjfields(String sObjName ){
        Map<String,String> fieldNamesAndLabelsMap=new Map<String,String>();
        Map<String,Schema.SObjectType> objMap=Schema.getGlobalDescribe();
        Schema.SObjectType sobjectInstance=objMap.get(sObjName);

        if(sobjectInstance!=null){
            DescribeSObjectResult sObjectDescribe=sobjectInstance.getDescribe();
            Map<String,Schema.SObjectField> fldMap = sObjectDescribe.fields.getMap();
            for(Schema.SObjectField field:fldMap.values()){
                Schema.DescribeFieldResult fieldResult = field.getDescribe();
                if(fieldResult.isAccessible()){
                    fieldNamesAndLabelsMap.put(fieldResult.getLabel(),fieldResult.getName());
                }
            }
        }
        return fieldNamesAndLabelsMap;
    }
    @AuraEnabled(cacheable=true)
    public static list<Sobject> getQueryResult(String querySring){
        
       String query=querySring;
       List<Sobject> sobjResult=Database.query(query);
        if(sobjResult.size()>0){
            return sobjResult;
        }
        return null; 
    }  
}