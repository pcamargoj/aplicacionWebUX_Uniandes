import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, RouterOutlet, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { RecurrenceDraftStore } from './recurrence-draft.store';
import { hasFrequencyGuard } from './recurrence.guard';

@Component({ template: '<router-outlet />', imports: [RouterOutlet] })
class FlowStub {}

@Component({ template: '' })
class StepStub {}

describe('hasFrequencyGuard', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'alarmas/:id/recurrencia',
            component: FlowStub,
            providers: [RecurrenceDraftStore],
            children: [
              { path: 'frecuencia', component: StepStub },
              { path: 'confirmar', component: StepStub, canActivate: [hasFrequencyGuard] },
            ],
          },
        ]),
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  const url = () => TestBed.inject(Router).url;

  it('redirige al paso de frecuencia si aún no hay frecuencia', async () => {
    await harness.navigateByUrl('/alarmas/7/recurrencia/confirmar');

    expect(url()).toBe('/alarmas/7/recurrencia/frecuencia');
  });

  it('deja pasar cuando el borrador ya tiene frecuencia', async () => {
    await harness.navigateByUrl('/alarmas/7/recurrencia/frecuencia');
    const store = harness.routeDebugElement!.injector.get(RecurrenceDraftStore);
    store.init('7', new Date(2026, 7, 26, 9, 0));

    await harness.navigateByUrl('/alarmas/7/recurrencia/confirmar');

    expect(url()).toBe('/alarmas/7/recurrencia/confirmar');
  });
});
