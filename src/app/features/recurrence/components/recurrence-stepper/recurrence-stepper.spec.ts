import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrenceStepper } from './recurrence-stepper';

describe('RecurrenceStepper', () => {
  let fixture: ComponentFixture<RecurrenceStepper>;

  const items = () =>
    Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('li')) as HTMLElement[];

  function render(current: number) {
    fixture = TestBed.createComponent(RecurrenceStepper);
    fixture.componentRef.setInput('steps', ['Frecuencia', 'Hasta cuándo', 'Confirmar']);
    fixture.componentRef.setInput('current', current);
    fixture.detectChanges();
  }

  it('muestra un paso por etiqueta, en una lista ordenada', () => {
    render(1);

    expect((fixture.nativeElement as HTMLElement).querySelector('ol')).toBeTruthy();
    expect(items().map((li) => li.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      '1 Frecuencia',
      '2 Hasta cuándo',
      '3 Confirmar',
    ]);
  });

  it('marca solo el paso actual con aria-current="step"', () => {
    render(2);

    expect(items().map((li) => li.getAttribute('aria-current'))).toEqual([null, 'step', null]);
  });

  it('muestra los pasos anteriores como completos, con un check', () => {
    render(3);

    const [first, second, third] = items();
    expect(first.classList).toContain('stepper__step--complete');
    expect(first.querySelector('mat-icon')?.textContent).toBe('check');
    expect(second.classList).toContain('stepper__step--complete');
    expect(third.classList).toContain('stepper__step--active');
    expect(third.querySelector('mat-icon')).toBeNull();
  });

  it('muestra los pasos siguientes como pendientes', () => {
    render(1);

    const [, second, third] = items();
    expect(second.classList).toContain('stepper__step--pending');
    expect(third.classList).toContain('stepper__step--pending');
  });
});
