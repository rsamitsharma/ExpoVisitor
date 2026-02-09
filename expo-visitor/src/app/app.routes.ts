import { Routes } from '@angular/router';
import { ExpoMasterComponent } from './expo-master/expo-master.component';
import { ExpoReportComponent } from './report/expo-report/expo-report.component';
import { VisitorMasterComponent } from './visitor-master/visitor-master.component';
import { VisitorReportComponent } from './report/visitor-report/visitor-report.component';
import { MailLogComponent } from './report/mail-log/mail-log.component';

export const routes: Routes = [
  { path: 'expo-master', component: ExpoMasterComponent },
  { path: 'visitor-master', component: VisitorMasterComponent },
  { path: 'report/expo-list', component: ExpoReportComponent },
  { path: 'report/visitor-list', component: VisitorReportComponent },
  { path: 'report/mail-logs', component: MailLogComponent },
  { path: '', redirectTo: '/visitor-master', pathMatch: 'full' }
];
