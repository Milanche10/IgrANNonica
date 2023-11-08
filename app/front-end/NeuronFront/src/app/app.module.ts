import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgxPaginationModule} from 'ngx-pagination';
import{ScrollingModule} from '@angular/cdk/scrolling';
import {NgxChartsModule} from '@swimlane/ngx-charts';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { FileuploadComponent } from './fileupload/fileupload.component'; 
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './shared/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TabledisplayComponent } from './tabledisplay/tabledisplay.component';
import { ChangedataComponent } from './changedata/changedata.component';
import { StatistikaComponent } from './statistika/statistika.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { NeuronnetworkComponent } from './neuronnetwork/neuronnetwork.component';
import { DatasetoperationsComponent } from './datasetoperations/datasetoperations.component';
import { NeuronnetworkVisualizerComponent } from './neuronnetwork-visualizer/neuronnetwork-visualizer.component';
import { OutputVisualizerComponent } from './output-visualizer/output-visualizer.component';
import { SelectComponent } from './select/select.component';
import { NnControlsComponent } from './nn-controls/nn-controls.component';
import { ChangeamountComponent } from './changeamount/changeamount.component';
import { SingleneuronComponent } from './singleneuron/singleneuron.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HeadComponent } from './head/head.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ExperimentsComponent } from './experiments/experiments.component';
import { DatePipe } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { CreatenetworkComponent } from './createnetwork/createnetwork.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptorService } from './token-interceptor.service';
import { GlobalExperimentControlsComponent } from './global-experiment-controls/global-experiment-controls.component';
import { ModelsOverviewComponent } from './models-overview/models-overview.component';
import { DialogKoloneComponent } from './dialog-kolone/dialog-kolone.component';
import { StartTrainingComponent } from './start-training/start-training.component';
import { ChartsComponent } from './charts/charts.component';
import { ModelsComponent } from './models/models.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {AdminComponent} from './admin/admin-form/admin-form.component';
import {AdminDetailComponent} from './admin/admin-detail.component';
import { EnkodiranjeDialogComponent } from './enkodiranje-dialog/enkodiranje-dialog.component';
import { MatTab, MatTabsModule } from '@angular/material/tabs'; 
import { ChartsModule } from 'ng2-charts';
import * as Chart from 'chart.js';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import { HttpInterceptorService } from './loadingScreen/http-interceptor.service';
import { PredictionComponentComponent } from './prediction-component/prediction-component.component';
import { BackgroundComponent } from './background/background.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ConstantsService } from './constants/constants.service';
import { EvaluationThingyComponent } from './evaluation-thingy/evaluation-thingy.component';

export function tokenGetter(){
  return localStorage.getItem("token"); 
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    NavbarComponent,
    FileuploadComponent,
    TabledisplayComponent,
    ChangedataComponent,
    StatistikaComponent,
    ProfileComponent,
    NeuronnetworkComponent,
    DatasetoperationsComponent,
    NeuronnetworkVisualizerComponent,
    OutputVisualizerComponent,
    SelectComponent,
    NnControlsComponent,
    ChangeamountComponent,
    SingleneuronComponent,
    HeadComponent,
    CreatenetworkComponent,
    ExperimentsComponent,
    GlobalExperimentControlsComponent,
    ModelsOverviewComponent,
    DialogKoloneComponent,
    StartTrainingComponent,
    ChartsComponent, 
    ModelsComponent,
    AdminComponent,
    AdminDetailComponent,
    EnkodiranjeDialogComponent,
    PredictionComponentComponent,
    BackgroundComponent,
    EvaluationThingyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, 
    NgxPaginationModule,
    ScrollingModule,
    NgxChartsModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    MatButtonModule,
    MatTableModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatChipsModule,
    MatCardModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatProgressBarModule, 
    MatDividerModule, 
    DragDropModule,
    ChartsModule,
    AppRoutingModule,
    NgbModule, 
    ToastrModule.forRoot({
      positionClass :'toast-top-right'
    }), 
    JwtModule.forRoot({
      config: { 
        tokenGetter: tokenGetter, 
        allowedDomains: [ConstantsService.port], 
        disallowedRoutes: []
      }
    }),
    RouterModule.forRoot([
      {path:'', component:HomeComponent},
      {path:'login', component:LoginComponent}, 
      {path:'register', component:RegisterComponent}, 
      {path:'fileupload', component:FileuploadComponent},
      {path: 'profile', component:ProfileComponent},
      {path: 'aa', component:CreatenetworkComponent},
      {path:'admin', component:AdminDetailComponent}
    ]),
    MatProgressSpinnerModule
  ],
  exports:[    
    ChartsModule
  ],
  providers: [UserService, DatePipe,
    {
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptorService,
    multi:true
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent],
  entryComponents:[
    DatasetoperationsComponent
  ]
})
export class AppModule { 

}
