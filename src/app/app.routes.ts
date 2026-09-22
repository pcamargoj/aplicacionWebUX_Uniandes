import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Alarms } from './features/alarms/alarms';
import { AlarmDetail } from './features/alarm-detail/alarm-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'alarmas', component: Alarms },
  { path: 'alarmas/:id', component: AlarmDetail },
];
