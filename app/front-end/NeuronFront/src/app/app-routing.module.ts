import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FileuploadComponent } from './fileupload/fileupload.component'; 
import { ProfileComponent } from './profile/profile.component';
import { CreatenetworkComponent } from './createnetwork/createnetwork.component';
import { AdminComponent } from './admin/admin-form/admin-form.component';
import { AdminDetailComponent } from './admin/admin-detail.component';
const routes: Routes = [
  {path:'', component:HomeComponent},
  {path:'login', component:LoginComponent}, 
  {path:'register', component:RegisterComponent},
  {path:'fileupload', component:FileuploadComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'neuronnetwork/:inputcolnum/:outputcolnum', component:CreatenetworkComponent},
  {path:'admin',component:AdminDetailComponent},
  {path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
