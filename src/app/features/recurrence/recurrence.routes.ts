import { Routes } from '@angular/router';

import { RecurrenceFlow } from './recurrence-flow/recurrence-flow';
import { RecurrenceDraftStore } from './recurrence-draft.store';
import { hasFrequencyGuard } from './recurrence.guard';
import { RecurrenceFrequency } from './steps/frequency/recurrence-frequency';
import { RecurrenceEnd } from './steps/end/recurrence-end';
import { RecurrenceConfirm } from './steps/confirm/recurrence-confirm';
import { RecurrenceSuccess } from './steps/success/recurrence-success';

// Flujo de recurrencia (WD14–WD17). El borrador vive mientras dura el flujo.
export const RECURRENCE_ROUTES: Routes = [
  {
    path: '',
    component: RecurrenceFlow,
    providers: [RecurrenceDraftStore],
    children: [
      { path: '', redirectTo: 'frecuencia', pathMatch: 'full' },
      {
        path: 'frecuencia',
        component: RecurrenceFrequency,
        data: { step: 1 },
        title: 'Frecuencia · Agregar recurrencia',
      },
      {
        path: 'fin',
        component: RecurrenceEnd,
        data: { step: 2 },
        title: 'Hasta cuándo · Agregar recurrencia',
        canActivate: [hasFrequencyGuard],
      },
      {
        path: 'confirmar',
        component: RecurrenceConfirm,
        data: { step: 3 },
        title: 'Confirmar · Agregar recurrencia',
        canActivate: [hasFrequencyGuard],
      },
      {
        path: 'listo',
        component: RecurrenceSuccess,
        data: { step: 4 },
        title: 'Recurrencia agregada',
        canActivate: [hasFrequencyGuard],
      },
    ],
  },
];
