import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatRadioModule } from '@angular/material/radio';

import { OptionCard } from './option-card';

@Component({
  imports: [MatRadioModule, OptionCard],
  template: `
    <mat-radio-group [value]="value()" (change)="value.set($event.value)">
      <app-option-card value="weekly" title="Semanalmente" subtitle="Elige los días" />
      <app-option-card value="monthly" title="Mensualmente" subtitle="Un día al mes" disabled />
    </mat-radio-group>
  `,
})
class Host {
  readonly value = signal('weekly');
}

describe('OptionCard', () => {
  let fixture: ComponentFixture<Host>;

  const cards = () =>
    Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('app-option-card'),
    ) as HTMLElement[];

  beforeEach(() => {
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  it('muestra el título y el subtítulo', () => {
    const [weekly] = cards();

    expect(weekly.querySelector('.option-card__title')?.textContent).toContain('Semanalmente');
    expect(weekly.querySelector('.option-card__subtitle')?.textContent).toContain('Elige los días');
  });

  it('se marca como seleccionada cuando el grupo tiene su valor', () => {
    const [weekly, monthly] = cards();

    expect(weekly.querySelector('input')?.checked).toBeTrue();
    expect(monthly.querySelector('input')?.checked).toBeFalse();
  });

  it('deshabilitada: no se puede elegir y muestra "Próximamente"', () => {
    const [, monthly] = cards();

    (monthly.querySelector('.option-card__title') as HTMLElement).click();
    fixture.detectChanges();

    expect(monthly.querySelector('input')?.disabled).toBeTrue();
    expect(fixture.componentInstance.value()).toBe('weekly');
    expect(monthly.textContent).toContain('Próximamente');
  });

  it('las habilitadas no muestran "Próximamente"', () => {
    expect(cards()[0].textContent).not.toContain('Próximamente');
  });
});

@Component({
  imports: [MatRadioModule, OptionCard],
  template: `
    <mat-radio-group [value]="value()" (change)="value.set($event.value)">
      <app-option-card value="never" title="Nunca termina" subtitle="Se repite siempre" />
      <app-option-card value="onDate" title="En una fecha" subtitle="Elige cuándo termina" />
    </mat-radio-group>
  `,
})
class TwoEnabledHost {
  readonly value = signal('never');
}

describe('OptionCard (selección)', () => {
  it('al hacer clic en el texto de la tarjeta se elige su valor', () => {
    const fixture = TestBed.createComponent(TwoEnabledHost);
    fixture.detectChanges();
    const onDate = (fixture.nativeElement as HTMLElement).querySelectorAll('app-option-card')[1];

    (onDate.querySelector('.option-card__subtitle') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('onDate');
    expect(onDate.querySelector('input')?.checked).toBeTrue();
  });
});
