import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '../../../../app.config';

describe('RecurrenceEnd (WD15)', () => {
  let harness: RouterTestingHarness;

  const page = () =>
    harness.fixture.nativeElement.querySelector('app-recurrence-end') as HTMLElement;
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();
  const option = (title: string) =>
    Array.from(page().querySelectorAll('app-option-card')).find(
      (card) => text(card.querySelector('.option-card__title')) === title,
    )!;
  const button = (label: string) =>
    Array.from(page().querySelectorAll('button')).find((b) => text(b) === label) as
      HTMLButtonElement | undefined;
  const calendar = () => page().querySelector('mat-calendar');
  const occurrences = () => Array.from(page().querySelectorAll('.end__occurrence')).map(text);
  const endNote = () => text(page().querySelector('.end__note'));

  async function click(element: Element) {
    (element as HTMLElement).click();
    harness.fixture.detectChanges();
    await harness.fixture.whenStable();
    harness.fixture.detectChanges();
  }

  async function chooseOnDate() {
    await click(option('Terminar en una fecha específica').querySelector('.option-card__title')!);
  }

  // Desde agosto 2026 (mes de la alarma) avanza un mes y elige el 16 de septiembre
  async function pickSeptember16() {
    await click(page().querySelector('[aria-label="Mes siguiente"]')!);
    await click(page().querySelector('[aria-label="16 de septiembre de 2026"]')!);
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/alarmas/1/recurrencia');
    await harness.navigateByUrl('/alarmas/1/recurrencia/fin');
  });

  it('muestra el título de la pantalla', () => {
    expect(text(page().querySelector('h1'))).toBe('¿Hasta cuándo se repite?');
  });

  it('empieza en "Nunca termina"; "N repeticiones" está deshabilitada', () => {
    const state = (title: string) => {
      const input = option(title).querySelector('input')!;
      return { checked: input.checked, disabled: input.disabled };
    };

    expect(state('Nunca termina')).toEqual({ checked: true, disabled: false });
    expect(state('Terminar en una fecha específica')).toEqual({ checked: false, disabled: false });
    expect(state('Terminar después de N repeticiones')).toEqual({ checked: false, disabled: true });
    expect(calendar()).toBeNull();
  });

  it('muestra las próximas 4 ocurrencias sin año y que no termina', () => {
    expect(occurrences()).toEqual(['Mié. 26 ago.', 'Mié. 2 sep.', 'Mié. 9 sep.', 'Mié. 16 sep.']);
    expect(endNote()).toBe('La alarma se repite indefinidamente');
  });

  it('al elegir "fecha específica" abre el calendario en el mes de la alarma', async () => {
    await chooseOnDate();

    expect(calendar()).toBeTruthy();
    expect(text(page().querySelector('.calendar-header__overline'))).toBe('SELECCIONA UNA FECHA');
    expect(text(page().querySelector('.calendar-header__month'))).toBe('Agosto 2026');
    expect(button('Siguiente')!.disabled).toBeTrue();
  });

  it('el encabezado muestra la fecha elegida antes de aceptarla', async () => {
    await chooseOnDate();
    await pickSeptember16();

    expect(text(page().querySelector('.calendar-header__date'))).toBe('mié, 16 sep 2026');
    expect(endNote()).toBe('La alarma se repite indefinidamente');
  });

  it('Aceptar guarda la fecha, cierra el calendario y actualiza las ocurrencias', async () => {
    await chooseOnDate();
    await pickSeptember16();

    await click(button('Aceptar')!);

    expect(calendar()).toBeNull();
    expect(endNote()).toBe('Se detendrá el 16 de septiembre de 2026');
    expect(button('Siguiente')!.disabled).toBeFalse();
  });

  it('corta las ocurrencias en la fecha de fin', async () => {
    await chooseOnDate();
    await click(page().querySelector('[aria-label="31 de agosto de 2026"]')!);
    await click(button('Aceptar')!);

    expect(occurrences()).toEqual(['Mié. 26 ago.']);
  });

  it('Cancelar sin fecha aceptada vuelve a "Nunca termina"', async () => {
    await chooseOnDate();
    await pickSeptember16();

    await click(button('Cancelar')!);

    expect(calendar()).toBeNull();
    expect(option('Nunca termina').querySelector('input')!.checked).toBeTrue();
    expect(button('Siguiente')!.disabled).toBeFalse();
  });

  it('con una fecha ya aceptada se puede reabrir el calendario para cambiarla', async () => {
    await chooseOnDate();
    await pickSeptember16();
    await click(button('Aceptar')!);

    await click(button('Cambiar fecha')!);

    expect(calendar()).toBeTruthy();
  });

  it('no deja elegir fechas anteriores a la alarma', async () => {
    await chooseOnDate();

    const cell = page().querySelector('[aria-label="25 de agosto de 2026"]')!;
    expect(cell.getAttribute('aria-disabled')).toBe('true');
  });

  it('Siguiente lleva al paso de confirmación', async () => {
    await click(button('Siguiente')!);

    expect(TestBed.inject(Router).url).toBe('/alarmas/1/recurrencia/confirmar');
  });
});
