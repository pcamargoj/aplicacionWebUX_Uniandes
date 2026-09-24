import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Home } from './features/home/home';
import { Alarms } from './features/alarms/alarms';
import { AlarmDetail } from './features/alarm-detail/alarm-detail';
import { RecurrenceFlow } from './features/recurrence/recurrence-flow/recurrence-flow';
import { RecurrenceDraftStore } from './features/recurrence/recurrence-draft.store';
import { hasFrequencyGuard } from './features/recurrence/recurrence.guard';
import { RecurrenceFrequency } from './features/recurrence/steps/frequency/recurrence-frequency';
import { RecurrenceEnd } from './features/recurrence/steps/end/recurrence-end';
import { RecurrenceConfirm } from './features/recurrence/steps/confirm/recurrence-confirm';
import { RecurrenceSuccess } from './features/recurrence/steps/success/recurrence-success';

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
    // Flujo de recurrencia (WD14–WD17). El borrador vive mientras dura el flujo.
    path: 'alarmas/:id/recurrencia',
    component: RecurrenceFlow,
    providers: [RecurrenceDraftStore],
    children: [
      { path: '', redirectTo: 'frecuencia', pathMatch: 'full' },
      { path: 'frecuencia', component: RecurrenceFrequency, data: { step: 1 } },
      {
        path: 'fin',
        component: RecurrenceEnd,
        data: { step: 2 },
        canActivate: [hasFrequencyGuard],
      },
      {
        path: 'confirmar',
        component: RecurrenceConfirm,
        data: { step: 3 },
        canActivate: [hasFrequencyGuard],
      },
      {
        path: 'listo',
        component: RecurrenceSuccess,
        data: { step: 4 },
        canActivate: [hasFrequencyGuard],
      },
    ],
  },
];
