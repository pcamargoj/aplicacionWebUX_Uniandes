import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { routes } from './app.routes';

describe('routes', () => {
  let harness: RouterTestingHarness;
  const root = () => harness.fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    harness = await RouterTestingHarness.create();
  });

  it('muestra Home dentro del Shell con la barra de navegación', async () => {
    await harness.navigateByUrl('/');

    expect(root().querySelector('app-shell nav')).toBeTruthy();
    expect(root().querySelector('app-shell app-home')).toBeTruthy();
  });

  it('muestra Mis alarmas dentro del Shell', async () => {
    await harness.navigateByUrl('/alarmas');

    expect(root().querySelector('app-shell app-alarms')).toBeTruthy();
  });

  it('muestra el detalle de la alarma sin el Shell (pantalla completa)', async () => {
    await harness.navigateByUrl('/alarmas/1');

    expect(root().querySelector('app-alarm-detail')).toBeTruthy();
    expect(root().querySelector('app-shell')).toBeNull();
  });
});
