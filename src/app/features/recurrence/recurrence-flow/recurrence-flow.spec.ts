import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '../../../app.config';

describe('RecurrenceFlow', () => {
  let harness: RouterTestingHarness;

  const root = () => harness.fixture.nativeElement as HTMLElement;
  const url = () => TestBed.inject(Router).url;
  const activeStep = () =>
    root().querySelector('app-recurrence-stepper [aria-current="step"]')?.textContent?.trim();
  // El botón del flujo termina en "Volver" (antes va el ícono); no confundir con "Volver al detalle"
  const backButton = () =>
    Array.from(root().querySelectorAll('button')).find((b) =>
      b.textContent?.trim().endsWith('Volver'),
    );

  async function clickBack() {
    backButton()!.click();
    await harness.fixture.whenStable();
  }

  beforeEach(async () => {
    // Configuración real de la app: rutas, input binding y locale
    TestBed.configureTestingModule({ providers: appConfig.providers });
    harness = await RouterTestingHarness.create();
  });

  it('entra al primer paso con el stepper en "Frecuencia"', async () => {
    await harness.navigateByUrl('/alarmas/1/recurrencia');

    expect(url()).toBe('/alarmas/1/recurrencia/frecuencia');
    expect(activeStep()).toContain('Frecuencia');
    expect(root().querySelector('app-recurrence-frequency')).toBeTruthy();
  });

  it('inicia el borrador, así que los pasos siguientes quedan accesibles', async () => {
    await harness.navigateByUrl('/alarmas/1/recurrencia');

    await harness.navigateByUrl('/alarmas/1/recurrencia/confirmar');

    expect(url()).toBe('/alarmas/1/recurrencia/confirmar');
    expect(activeStep()).toContain('Confirmar');
  });

  it('si la alarma no existe, vuelve a Mis alarmas', async () => {
    await harness.navigateByUrl('/alarmas/999/recurrencia');
    await harness.fixture.whenStable();

    expect(url()).toBe('/alarmas');
  });

  it('Volver en el primer paso regresa al detalle de la alarma', async () => {
    await harness.navigateByUrl('/alarmas/1/recurrencia');

    await clickBack();

    expect(url()).toBe('/alarmas/1');
  });

  it('Volver en los pasos siguientes regresa al paso anterior', async () => {
    await harness.navigateByUrl('/alarmas/1/recurrencia');
    await harness.navigateByUrl('/alarmas/1/recurrencia/confirmar');

    await clickBack();
    expect(url()).toBe('/alarmas/1/recurrencia/fin');

    await clickBack();
    expect(url()).toBe('/alarmas/1/recurrencia/frecuencia');
  });

  it('al cambiar de paso mueve el foco al título del paso nuevo', async () => {
    await harness.navigateByUrl('/alarmas/1/recurrencia');

    Array.from(root().querySelectorAll('button'))
      .find((b) => b.textContent?.trim() === 'Continuar')!
      .click();
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();

    expect(document.activeElement?.tagName).toBe('H1');
    expect(document.activeElement?.textContent).toContain('¿Hasta cuándo se repite?');
  });

  it('la pantalla de éxito no tiene stepper ni Volver', async () => {
    await harness.navigateByUrl('/alarmas/1/recurrencia');
    await harness.navigateByUrl('/alarmas/1/recurrencia/listo');

    expect(root().querySelector('app-recurrence-success')).toBeTruthy();
    expect(root().querySelector('app-recurrence-stepper')).toBeNull();
    expect(backButton()).toBeUndefined();
  });

  it('se abre desde "Agregar recurrencia" en el detalle de la alarma', async () => {
    await harness.navigateByUrl('/alarmas/1');

    Array.from(root().querySelectorAll('button'))
      .find((b) => b.textContent?.includes('Agregar recurrencia'))!
      .click();
    await harness.fixture.whenStable();

    expect(url()).toBe('/alarmas/1/recurrencia/frecuencia');
  });
});
