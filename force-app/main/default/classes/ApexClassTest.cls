@isTest
public class ApexClassTest {
    @isTest
    static void testGetObjfields() {
        Test.startTest();
        Map<String, String> result = ApexClass.getObjfields('Contact');
        Test.stopTest();

        System.assertNotEquals(null, result, 'Expected a non-null result');
        System.assertEquals(true, result.containsKey('Email'), 'Expected Email field to be present');
    }

    @isTest
    static void testGetQueryResult() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;

        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact',
            Email = 'test.contact@example.com',
            AccountId = testAccount.Id
        );
        insert testContact;

        String query = 'SELECT Id, FirstName, LastName, Email FROM Contact WHERE AccountId = \'' + testAccount.Id + '\'';

        Test.startTest();
        List<SObject> queryResult = ApexClass.getQueryResult(query);
        Test.stopTest();

        System.assertNotEquals(null, queryResult, 'Expected a non-null query result');
        System.assertEquals(1, queryResult.size(), 'Expected exactly one record');
        System.assertEquals(testContact.Id, queryResult[0].Id, 'Expected the correct contact record');
    }
}
