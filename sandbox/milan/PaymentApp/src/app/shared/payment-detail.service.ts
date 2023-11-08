import { Injectable } from '@angular/core';
import { PaymentDetail } from './payment-detail.model';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailService {

  constructor(private http: HttpClient) { }

  formData:PaymentDetail = new PaymentDetail();
  readonly baseURL = 'http://localhost:5000/api/PaymentDetail';
  list : PaymentDetail[];

  postPaymentDetail(){
    return this.http.post(this.baseURL,this.formData);
  }

  //Moram da pogledam kako da refresujem listu
  refreshList(){
    //this.http.get(this.baseURL).toPromise().then(res=>this.list = res as PaymentDetail[]);
    this.http.get<PaymentDetail[]>(this.baseURL).subscribe(res=>this.list = res as PaymentDetail[])
    //this.http.get<Student[]>(this.baseUrl + 'api/student').subscribe(result => {
      //this.students = result;}
  }

  putPaymentDetail(){
    return this.http.put(`${this.baseURL}/${this.formData.paymentDetailId}`,this.formData);
  }


  deletePaymentDetail(id:number){
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
