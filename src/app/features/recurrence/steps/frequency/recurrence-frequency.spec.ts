import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '../../../../app.config';

describe('RecurrenceFrequency (WD14)', () => {
  let harness: RouterTestingHarness;

  const page = () =>
    harness.fixture.nativeElement.querySelector('app-recurrence-frequency') as HTMLElement;
  const dayButton = (name: string) =>
    page().querySelector(`button[aria-label="${name}"]`) as HTMLButtonElement;
  const banner = () => page().querySelector('[aria-live="polite"]')?.textContent?.trim();
  const continueButton = () =>
    Array.from(page().querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Continuar'),
    ) as HTMLButtonElement;

  async function click(element: HTMLElement) {
    element.click();
    harness.fixture.detectChanges();
    await harness.fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/alarmas/1/recurrencia/frecuencia');
  });

  it('muestra el título de la pantalla', () => {
    expect(page().querySelector('h1')?.textContent).toContain('¿Con qué frecuencia se repite?');
  });

  it('solo "Semanalmente" está habilitada y viene seleccionada', () => {
    const radios = Array.from(page().querySelectorAll('app-option-card')).map((card) => ({
      title: card.querySelector('.option-card__title')?.textContent?.trim(),
      disabled: card.querySelector('input')!.disabled,
      checked: card.querySelector('input')!.checked,
    }));

    expect(radios).toEqual([
      { title: 'Todos los días', disabled: true, checked: false },
      { title: 'Semanalmente', disabled: false, checked: true },
      { title: 'Mensualmente', disabled: true, checked: false },
      { title: 'Personalizar', disabled: true, checked: false },
    ]);
  });

  it('empieza con el día de la alarma (miércoles) seleccionado', () => {
    expect(dayButton('Miércoles').getAttribute('aria-pressed')).toBe('true');
    expect(dayButton('Lunes').getAttribute('aria-pressed')).toBe('false');
    expect(banner()).toContain('Se repetirá todos los miércoles.');
  });

  it('al elegir otro día lo marca y actualiza el resumen', async () => {
    await click(dayButton('Lunes'));

    expect(dayButton('Lunes').getAttribute('aria-pressed')).toBe('true');
    expect(banner()).toContain('Se repetirá los lunes y miércoles.');
  });

  it('al cambiar el intervalo pluraliza "semana" y actualiza el resumen', async () => {
    const select = page().querySelector('select') as HTMLSelectElement;

    select.value = '2';
    select.dispatchEvent(new Event('change'));
    harness.fixture.detectChanges();

    expect(page().textContent).toContain('semanas');
    expect(banner()).toContain('Se repetirá cada 2 semanas los miércoles.');
  });

  it('deshabilita Continuar si no hay días seleccionados', async () => {
    expect(continueButton().disabled).toBeFalse();

    await click(dayButton('Miércoles'));

    expect(continueButton().disabled).toBeTrue();
  });

  it('Continuar lleva al paso "Hasta cuándo"', async () => {
    await click(continueButton());

    expect(TestBed.inject(Router).url).toBe('/alarmas/1/recurrencia/fin');
  });
});
