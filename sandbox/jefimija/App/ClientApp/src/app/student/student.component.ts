import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html'
})
export class StudentComponent {
  students: Student[] = [];
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    http.get<Student[]>(baseUrl + 'api/student').subscribe(result => {
      this.students = result;
    }, error => console.error(error));
  }
  add(name: string, surname: string) {
    this.http.post<Student>(this.baseUrl + 'api/student', <Student>{ Name: name, Surname: surname }).subscribe(result => {
    }, error => console.error(error));
    this.http.get<Student[]>(this.baseUrl + 'api/student').subscribe(result => {
      this.students = result;
    }, error => console.error(error));
  }
}
interface Student { 
  Name: string,
  Surname: string
}
