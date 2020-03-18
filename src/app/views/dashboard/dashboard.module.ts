import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import {
  MatIconModule,
  MatCardModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatChipsModule,
  MatListModule,
  MatGridListModule,
  MatExpansionModule,
  MatTabsModule,
  MatTableModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from 'app/shared/pipes/shared-pipes.module';
import { DashboardRoutes } from "./dashboard.routing";
import { AnalyticsComponent } from './analytics/analytics.component';
import { DashboardDarkComponent } from './dashboard-dark/dashboard-dark.component';
import { CryptocurrencyComponent } from './cryptocurrency/cryptocurrency.component';
import { DefaultDashboardComponent } from './default-dashboard/default-dashboard.component';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    HighchartsChartModule, RoundProgressModule,
    CommonModule, SharedMaterialModule, HttpClientModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule, ReactiveFormsModule,FormsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatGridListModule,
    FlexLayoutModule,
    ChartsModule,
    NgxEchartsModule,
    NgxDatatableModule,
    SharedPipesModule,
    RouterModule.forChild(DashboardRoutes)
  ],
  declarations: [AnalyticsComponent, DashboardDarkComponent, CryptocurrencyComponent, DefaultDashboardComponent],
  exports: [],
  providers: [DatePipe]

})
export class DashboardModule {

}