import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin-service';
import { AdminUser } from 'app/models-ts/User';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.css']
})
export class AdminDetailComponent implements OnInit {

  constructor(public service: AdminService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.service.refreshList();
  }

  populateForm(selectedRecord:AdminUser){
    this.service.formData = Object.assign({},selectedRecord);
  }

  onDelete(id:string){
    if(confirm('Are you sure you want to delete this')){
      this.service.deleteAdminUser(id).subscribe(
        res=>{
          this.service.refreshList();
          this.toastr.error("Deleted successfully",'User');
        },
        err=>{console.log(err)}
      );
    }
    

  }
  refreshPage(){
    window.location.reload();
  }

}
