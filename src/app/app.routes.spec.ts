import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from './app.config';

describe('routes', () => {
  let harness: RouterTestingHarness;
  const root = () => harness.fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    // Configuración real: rutas + input binding (el detalle lee :id como input)
    TestBed.configureTestingModule({ providers: appConfig.providers });
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

  describe('títulos de página', () => {
    const title = () => TestBed.inject(Title).getTitle();

    it('nombra cada pantalla y agrega el nombre de la app', async () => {
      await harness.navigateByUrl('/');
      expect(title()).toBe('Inicio · Siempre a Tiempo');

      await harness.navigateByUrl('/alarmas');
      expect(title()).toBe('Mis alarmas · Siempre a Tiempo');
    });

    it('usa el nombre de la alarma en su detalle', async () => {
      await harness.navigateByUrl('/alarmas/2');
      expect(title()).toBe('Reunión interna · Siempre a Tiempo');

      await harness.navigateByUrl('/alarmas/999');
      expect(title()).toBe('Alarma no encontrada · Siempre a Tiempo');
    });

    it('indica el paso del flujo de recurrencia', async () => {
      await harness.navigateByUrl('/alarmas/1/recurrencia');
      expect(title()).toBe('Frecuencia · Agregar recurrencia · Siempre a Tiempo');

      await harness.navigateByUrl('/alarmas/1/recurrencia/fin');
      expect(title()).toBe('Hasta cuándo · Agregar recurrencia · Siempre a Tiempo');

      await harness.navigateByUrl('/alarmas/1/recurrencia/listo');
      expect(title()).toBe('Recurrencia agregada · Siempre a Tiempo');
    });
  });
});
