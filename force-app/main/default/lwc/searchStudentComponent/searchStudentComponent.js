import { LightningElement, track ,wire} from 'lwc';
import getStudentByName  from '@salesforce/apex/SearchStudentController.getStudentByName';
import getTeachersByStudentId from '@salesforce/apex/SearchStudentController.getTeachersByStudentId';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Student Name', fieldName: 'Student_Name__c' },
    { label: 'Father Name', fieldName: 'Father_Name__c' },
    { label: 'Mother Name', fieldName: 'Mother_Name__c' },
];

export default class SearchStudentComponent extends LightningElement {
    @track columns = columns;
    @track students=[];
    @track error;
    @track studentName='';
    @track student;
    @track teachers=[];


    handleSearch(event){
        this.studentName = this.template.querySelector('lightning-input').value;
        if (this.studentName !== '') {        
        getStudentByName({ studentName: this.studentName })
        .then (result=>{
            this.students = result;
            if(this.students.length === 1)
            {
                this.viewStudent(this.students[0]);
            }
            else 
            {
            this.student = undefined;
            console.log('coloums:'+this.columns);

            console.log('result:'+result);
            console.log('students:'+this.students.length);
    }
        })
        .catch(error=>{
            this.error = error;
        })
    }else
    {
        const event = new ShowToastEvent({
            variant: 'error',
            message: 'Search text missing..',
        });
        this.dispatchEvent(event);

    }
    }
/*
    handleChosenRow(){
        if(selectedRows.length>1)
            handleRowSelection;
        else if (selectedRows.length==1)
        {
            
            var el = this.template.querySelector('lightning-datatable');
            var selected = el.getSelectedRows();
            let selectedIdsArray = [];

            for (const element of selected) {
                //console.log('elementid', element.Id);
                selectedIdsArray.push(element.Id); 
                this.viewStudent(selectedIdsArray[0]);
        }
    }
}*/
    handleRowSelection =event =>{
        var selectedRows = event.detail.selectedRows;
        if(selectedRows.length>1)
        {
            var el = this.template.querySelector('lightning-datatable');
            selectedRows=el.selectedRows=el.selectedRows.slice(1);
            this.showNotification();
            event.preventDefault();
            return;
        }
    }
    showNotification(){
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'only one row can be selcted',
            variant: 'warning',
            mode:'pester'
        });
        this.dispatchEvent(event);
    }

    viewStudent(student)
    {
        this.student = student;
                getTeachersByStudentId({studentId: this.student.Id})
                .then (result=>{
                    this.teachers = result;
                    console.log('teachers:'+ this.teachers);

                })
    }
    
    }