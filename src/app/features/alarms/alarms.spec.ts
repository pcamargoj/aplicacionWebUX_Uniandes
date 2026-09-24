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

  it('cada interruptor dice de qué alarma es', () => {
    const toggle = items()[1].querySelector('button[role="switch"]')!;

    expect(toggle.getAttribute('aria-label')).toBe('Activar alarma: Reunión interna');
  });

  it('las pestañas indican cuál filtro está activo', async () => {
    const pressed = () =>
      Array.from(el().querySelectorAll('.alarms-page__tab')).map((tab) =>
        tab.getAttribute('aria-pressed'),
      );

    expect(pressed()).toEqual(['true', 'false', 'false', 'false']);

    await clickTab('Hoy');

    expect(pressed()).toEqual(['false', 'true', 'false', 'false']);
  });

  it('la navegación de filtros tiene nombre propio', () => {
    expect(el().querySelector('.alarms-page__tabs')?.getAttribute('aria-label')).toBe(
      'Filtrar alarmas',
    );
  });

  describe('resumen', () => {
    const summary = () => text(el().querySelector('.alarms-page__summary span'));

    it('cuenta las alarmas activas y el tiempo hasta la próxima salida', () => {
      // "Ahora" en el prototipo: 6:10 AM; la próxima salida es a las 8:20 AM
      expect(summary()).toBe('6 alarmas activas · Próxima salida en 2h 10min');
    });

    it('se actualiza al desactivar alarmas', () => {
      TestBed.inject(AlarmsService).setEnabled('1', false);
      fixture.detectChanges();

      expect(summary()).toBe('5 alarmas activas · Próxima salida en 4h 20min');
    });

    it('usa singular y avisa si no hay salidas próximas', () => {
      const service = TestBed.inject(AlarmsService);
      ['1', '2', '3', '4', '5'].forEach((id) => service.setEnabled(id, false));
      fixture.detectChanges();
      expect(summary()).toBe('1 alarma activa · Próxima salida en 4 días');

      service.setEnabled('6', false);
      fixture.detectChanges();
      expect(summary()).toBe('No tienes alarmas activas');
    });
  });
});
