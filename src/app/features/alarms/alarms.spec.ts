import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlarmsService } from '../../core/alarms.service';
import { Alarms } from './alarms';

describe('Alarms', () => {
  let fixture: ComponentFixture<Alarms>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = (e: Element | null | undefined) => e?.textContent?.replace(/\s+/g, ' ').trim();
  const items = () => Array.from(el().querySelectorAll('.alarms-page__item'));
  const titles = () => items().map((item) => text(item.querySelector('.alarms-page__name')));

  async function clickTab(label: string) {
    Array.from(el().querySelectorAll<HTMLButtonElement>('.alarms-page__tab'))
      .find((tab) => text(tab) === label)!
      .click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alarms],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Alarms);
    fixture.detectChanges();
  });

  it('lista las alarmas del servicio', () => {
    expect(titles()).toEqual([
      'Reunión semanal de ventas',
      'Reunión interna',
      'Presentación proyecto',
      'Almuerzo con proveedor',
      'Cita con el dentista',
      'Cena familiar',
    ]);
  });

  it('calcula cuándo es y a qué hora salir a partir de las fechas', () => {
    const [today, , tomorrow, , later] = items();

    expect(text(today.querySelector('.alarms-page__when'))).toBe('9:00 AM');
    expect(text(today.querySelector('.alarms-page__meta'))).toBe(
      'Oficina principal · Sale a las 8:20 AM',
    );
    expect(text(tomorrow.querySelector('.alarms-page__when'))).toBe('Mañana · 8:00 AM');
    expect(text(later.querySelector('.alarms-page__when'))).toBe('Sáb · 9:00 AM');
  });

  it('filtra por hoy y por mañana', async () => {
    await clickTab('Hoy');
    expect(titles()).toEqual([
      'Reunión semanal de ventas',
      'Reunión interna',
      'Almuerzo con proveedor',
    ]);

    await clickTab('Mañana');
    expect(titles()).toEqual(['Presentación proyecto']);
  });

  it('cada alarma enlaza a su detalle', () => {
    const link = items()[1].querySelector('a')!;

    expect(link.getAttribute('href')).toBe('/alarmas/2');
  });

  it('el interruptor activa y desactiva la alarma en el servicio', () => {
    const toggle = items()[1].querySelector<HTMLButtonElement>('button[role="switch"]')!;

    toggle.click();
    fixture.detectChanges();

    expect(TestBed.inject(AlarmsService).getById('2')?.enabled).toBeFalse();
  });
});
