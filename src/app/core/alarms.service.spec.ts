import { TestBed } from '@angular/core/testing';

import { AlarmsService } from './alarms.service';

describe('AlarmsService', () => {
  let service: AlarmsService;

  beforeEach(() => {
    service = TestBed.inject(AlarmsService);
  });

  it('tiene las 6 alarmas de "Mis alarmas"', () => {
    expect(service.alarms().map((a) => a.title)).toEqual([
      'Reunión semanal de ventas',
      'Reunión interna',
      'Presentación proyecto',
      'Almuerzo con proveedor',
      'Cita con el dentista',
      'Cena familiar',
    ]);
  });

  it('devuelve la alarma del detalle (WD13), sin recurrencia al empezar', () => {
    expect(service.getById('1')).toEqual({
      id: '1',
      title: 'Reunión semanal de ventas',
      location: 'Oficina principal',
      transport: 'Carro',
      notes: 'Reunión semanal del equipo de ventas.',
      meetingAt: new Date(2026, 7, 26, 9, 0),
      departureAt: new Date(2026, 7, 26, 8, 20),
      enabled: true,
      recurrence: null,
    });
  });

  it('devuelve undefined si la alarma no existe', () => {
    expect(service.getById('999')).toBeUndefined();
  });

  it('activa y desactiva una alarma', () => {
    service.setEnabled('2', false);

    expect(service.getById('2')?.enabled).toBeFalse();
    expect(service.getById('1')?.enabled).toBeTrue();
  });

  it('guarda la recurrencia de una alarma', () => {
    const recurrence = {
      frequency: { type: 'weekly' as const, interval: 1, weekdays: [2 as const] },
      end: { type: 'never' as const },
    };

    service.setRecurrence('1', recurrence);

    expect(service.getById('1')?.recurrence).toEqual(recurrence);
    expect(service.getById('2')?.recurrence).toBeNull();
  });
});
