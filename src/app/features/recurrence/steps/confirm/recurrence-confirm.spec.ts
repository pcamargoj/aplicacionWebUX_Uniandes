import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '../../../../app.config';
import { RecurrenceDraftStore } from '../../recurrence-draft.store';

describe('RecurrenceConfirm (WD16)', () => {
  let harness: RouterTestingHarness;
  let store: RecurrenceDraftStore;

  const page = () =>
    harness.fixture.nativeElement.querySelector('app-recurrence-confirm') as HTMLElement;
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();
  const fact = (label: string) =>
    Array.from(page().querySelectorAll('.confirm__fact')).find(
      (f) => text(f.querySelector('dt')) === label,
    );
  const button = (label: string) =>
    Array.from(page().querySelectorAll('button')).find((b) => text(b) === label)!;

  async function goToConfirm() {
    await harness.navigateByUrl('/alarmas/1/recurrencia/confirmar');
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/alarmas/1/recurrencia');
    store = harness.routeDebugElement!.injector.get(RecurrenceDraftStore);
  });

  it('muestra el título y la alarma con su frecuencia y hora', async () => {
    await goToConfirm();

    expect(text(page().querySelector('h1'))).toBe('Confirma tu alarma recurrente');
    expect(text(page().querySelector('.confirm__alarm-title'))).toBe('Reunión semanal de ventas');
    expect(text(page().querySelector('.confirm__alarm-subtitle'))).toBe(
      'Todos los miércoles · 9:00 AM',
    );
  });

  it('resume la recurrencia elegida: repite, termina y salida sugerida', async () => {
    store.toggleWeekday(0);
    await goToConfirm();

    expect(text(fact('Repite')?.querySelector('dd'))).toBe('Los lunes y miércoles');
    expect(text(fact('Termina')?.querySelector('dd'))).toBe('Nunca');
    expect(text(fact('Salida sugerida')?.querySelector('dd'))).toBe('8:20 AM');
  });

  it('muestra la fecha de fin cuando la hay', async () => {
    store.setEnd({ type: 'onDate', date: new Date(2026, 11, 16) });
    await goToConfirm();

    expect(text(fact('Termina')?.querySelector('dd'))).toBe('16 de diciembre de 2026');
  });

  it('lista las próximas 3 ocurrencias', async () => {
    await goToConfirm();

    const rows = page().querySelectorAll('app-occurrences-table tbody tr');
    expect(rows.length).toBe(3);
    expect(text(rows[0].querySelector('th'))).toBe('Mié. 26 ago. 2026');
  });

  it('Atrás vuelve al paso "Hasta cuándo"', async () => {
    await goToConfirm();

    button('Atrás').click();
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/alarmas/1/recurrencia/fin');
  });

  it('Confirmar recurrencia confirma el borrador y lleva a la pantalla de éxito', async () => {
    await goToConfirm();

    button('Confirmar recurrencia').click();
    await harness.fixture.whenStable();

    expect(store.confirmed()).toBeTrue();
    expect(TestBed.inject(Router).url).toBe('/alarmas/1/recurrencia/listo');
  });
});
