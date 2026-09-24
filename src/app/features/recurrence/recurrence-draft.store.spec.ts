import { TestBed } from '@angular/core/testing';

import { RecurrenceDraftStore } from './recurrence-draft.store';

// Alarma de referencia del diseño: miércoles 26 de agosto de 2026, 9:00 AM
const ALARM_START = new Date(2026, 7, 26, 9, 0);

describe('RecurrenceDraftStore', () => {
  let store: RecurrenceDraftStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RecurrenceDraftStore] });
    store = TestBed.inject(RecurrenceDraftStore);
  });

  it('no tiene frecuencia antes de iniciar el flujo', () => {
    expect(store.draft().frequency).toBeNull();
    expect(store.summaryLabel()).toBe('');
    expect(store.nextOccurrences()).toEqual([]);
  });

  it('inicia semanal, cada 1 semana, el día de la alarma y sin fin', () => {
    store.init('1', ALARM_START);

    expect(store.draft()).toEqual({
      alarmId: '1',
      frequency: { type: 'weekly', interval: 1, weekdays: [2] },
      end: { type: 'never' },
    });
    expect(store.summaryLabel()).toBe('todos los miércoles');
    expect(store.endLabel()).toBe('Nunca');
  });

  it('expone la fecha de la alarma (mínimo del calendario de fin)', () => {
    expect(store.alarmStart()).toBeNull();

    store.init('1', ALARM_START);

    expect(store.alarmStart()).toEqual(ALARM_START);
  });

  it('calcula las próximas 4 ocurrencias desde la fecha de la alarma', () => {
    store.init('1', ALARM_START);

    expect(store.nextOccurrences()).toEqual([
      new Date(2026, 7, 26, 9, 0),
      new Date(2026, 8, 2, 9, 0),
      new Date(2026, 8, 9, 9, 0),
      new Date(2026, 8, 16, 9, 0),
    ]);
  });

  it('agrega y quita días con toggleWeekday', () => {
    store.init('1', ALARM_START);

    store.toggleWeekday(0);
    expect(store.draft().frequency?.weekdays).toEqual([2, 0]);
    expect(store.summaryLabel()).toBe('los lunes y miércoles');

    store.toggleWeekday(2);
    expect(store.draft().frequency?.weekdays).toEqual([0]);
  });

  it('cambia el intervalo de semanas', () => {
    store.init('1', ALARM_START);

    store.setWeekInterval(2);

    expect(store.draft().frequency?.interval).toBe(2);
    expect(store.summaryLabel()).toBe('cada 2 semanas los miércoles');
  });

  it('aplica la regla de fin a las ocurrencias y al texto', () => {
    store.init('1', ALARM_START);

    store.setEnd({ type: 'onDate', date: new Date(2026, 8, 2) });

    expect(store.endLabel()).toBe('Se detendrá el 2 de septiembre de 2026');
    expect(store.nextOccurrences().length).toBe(2);
  });

  it('marca el borrador como confirmado', () => {
    store.init('1', ALARM_START);
    expect(store.confirmed()).toBeFalse();

    store.confirm();

    expect(store.confirmed()).toBeTrue();
  });
});
