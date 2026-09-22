import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Alarms } from './features/alarms/alarms';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'alarmas', component: Alarms },
];
