import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RecurrenceDraftStore } from './recurrence-draft.store';

// Los pasos 2–4 necesitan una frecuencia elegida; si no la hay (p. ej. al entrar por URL
// directa), se vuelve al paso de frecuencia del mismo flujo.
export const hasFrequencyGuard: CanActivateFn = (route) => {
  if (inject(RecurrenceDraftStore).draft().frequency) {
    return true;
  }
  const flowPath = (route.parent?.pathFromRoot ?? []).flatMap((r) => r.url.map((s) => s.path));
  return inject(Router).createUrlTree(['/', ...flowPath, 'frecuencia']);
};
