public with sharing class SearchStudentController {
    public SearchStudentController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Student__c> getStudentByName(String studentName){
        try {
            String search = '%' + studentName + '%';
            List<Student__c> studentSearch = new List<Student__c>();
            for(Student__c studentRecord : [SELECT Id, Student_Name__c,Father_Name__c, Mother_Name__c,Level__c
                                            FROM Student__c
                                            WHERE Student_Name__c like : search]){
                    studentSearch.add(studentRecord);
                        }
            return studentSearch;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

        @AuraEnabled(cacheable=true)
        public static List<Student_Teacher__c> getTeachersByStudentId(Id studentId){
        try {
            List<Student_Teacher__c> teachersAssigned = new List<Student_Teacher__c>([SELECT Teacher__r.Id,Teacher__r.Teacher_Name__c, Teacher__r.Subjects__c
                                                                    FROM Student_Teacher__c
                                                                    WHERE Student__c =: studentId ]);
            return teachersAssigned;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
