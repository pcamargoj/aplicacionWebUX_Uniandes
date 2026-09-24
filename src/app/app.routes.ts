import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Home } from './features/home/home';
import { Alarms } from './features/alarms/alarms';
import { AlarmDetail } from './features/alarm-detail/alarm-detail';

export const routes: Routes = [
  {
    // Pantallas con barra lateral (WD02, WD08)
    path: '',
    component: Shell,
    children: [
      { path: '', component: Home },
      { path: 'alarmas', component: Alarms },
    ],
  },
  // Pantalla completa, sin barra lateral (WD13)
  { path: 'alarmas/:id', component: AlarmDetail },
  {
    // Carga diferida: el flujo trae mat-datepicker, que no hace falta en el bundle inicial
    path: 'alarmas/:id/recurrencia',
    loadChildren: () =>
      import('./features/recurrence/recurrence.routes').then((m) => m.RECURRENCE_ROUTES),
  },
];
