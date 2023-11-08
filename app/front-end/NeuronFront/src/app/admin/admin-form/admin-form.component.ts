import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service';
import {NgForm} from '@angular/forms';
import { AdminUser } from 'app/models-ts/User';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css']
})
export class AdminComponent implements OnInit {

  constructor(public service:AdminService,
    private toastr:ToastrService
    ) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    if(this.service.formData.Id==''){
      this.insertRecord(form);
    }
    else{ 
      this.updateRecord(form);
    }
  }

  insertRecord(form:NgForm){
    this.service.postAdminUser().subscribe(
      res=>{
        this.resetForm(form);
        this.service.refreshList();
        this.toastr.success('Submitted Successfully','User');
      },
      err=>{console.log(err);}
    );
  }
//Mora pogledam
  updateRecord(form:NgForm){
    this.service.putAdminUser().subscribe(
      res=>{
        this.resetForm(form);
        this.service.refreshList();
        this.toastr.info('Updated Successfully','User');
      },
      err=>{console.log(err);}
    );
  }

  resetForm(form:NgForm){
    form.form.reset();
    this.service.formData = new AdminUser();
  }

}
