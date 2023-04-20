@isTest
private class ApexClassTest {
    @testSetup
    static void setup() {
        // Create a sample Account record
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;

        // Create a sample Contact record
        Contact testContact = new Contact(FirstName='John', LastName='Doe', AccountId=testAccount.Id);
        insert testContact;
    }

    @isTest
    static void testGetObjFields() {
        // Test Account object fields
        Map<String, String> accountFields = ApexClass.getObjfields('Account');
        System.assertNotEquals(null, accountFields, 'Account fields should not be null');
        System.assert(accountFields.size() > 0, 'Account fields should not be empty');
        
        // Test Contact object fields
        Map<String, String> contactFields = ApexClass.getObjfields('Contact');
        System.assertNotEquals(null, contactFields, 'Contact fields should not be null');
        System.assert(contactFields.size() > 0, 'Contact fields should not be empty');
    }

    @isTest
    static void testGetQueryResult() {
        // Test Account query
        String accountQuery = 'SELECT Id, Name FROM Account';
        List<SObject> accountResults = ApexClass.getQueryResult(accountQuery);
        System.assertNotEquals(null, accountResults, 'Account query results should not be null');
        System.assertEquals(1, accountResults.size(), 'Account query should return 1 record');

        // Test Contact query
        String contactQuery = 'SELECT Id, FirstName, LastName, AccountId FROM Contact';
        List<SObject> contactResults = ApexClass.getQueryResult(contactQuery);
        System.assertNotEquals(null, contactResults, 'Contact query results should not be null');
        System.assertEquals(1, contactResults.size(), 'Contact query should return 1 record');

        // Test a query that returns no records
        String noResultQuery = 'SELECT Id, Name FROM Account WHERE Name = \'Nonexistent Account\'';
        List<SObject> noResult = ApexClass.getQueryResult(noResultQuery);
        System.assertEquals(null, noResult, 'Query with no results should return null');
    }
}
