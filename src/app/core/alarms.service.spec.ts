import { TestBed } from '@angular/core/testing';

import { AlarmsService } from './alarms.service';

describe('AlarmsService', () => {
  it('devuelve la alarma pedida con su reunión y la salida sugerida', () => {
    const alarm = TestBed.inject(AlarmsService).getById('1');

    expect(alarm).toEqual({
      id: '1',
      title: 'Reunión semanal de ventas',
      meetingAt: new Date(2026, 7, 26, 9, 0),
      departureAt: new Date(2026, 7, 26, 8, 20),
    });
  });
});
