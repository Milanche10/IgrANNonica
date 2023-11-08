import { Injectable } from '@angular/core';
import { AdminUser } from 'app/models-ts/User';
import {HttpClient} from "@angular/common/http";
import { ConstantsService } from 'app/constants/constants.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  formData:AdminUser = new AdminUser();
  private baseUrl:String = ConstantsService.baseURL+'Admin';
  list : AdminUser[]=[];

  postAdminUser(){
    return this.http.post(this.baseUrl+'/addUser',this.formData);
  }

  //Moram da pogledam kako da refresujem listu
  refreshList(){
    //this.http.get(this.baseURL).toPromise().then(res=>this.list = res as UserRegister[]);
    this.http.get<AdminUser[]>(this.baseUrl+"/getUsers").subscribe(res=>this.list = res as AdminUser[])
    //this.http.get<Student[]>(this.baseUrl + 'api/student').subscribe(result => {
      //this.students = result;}
  }

  putAdminUser(){
    return this.http.put(`${this.baseUrl}/${this.formData.Id}`,this.formData);
  }


  deleteAdminUser(id:string){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
