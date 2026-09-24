import { FrequencyConfig } from './recurrence.model';
import {
  endSummary,
  formatDuration,
  formatMonthYear,
  formatOccurrence,
  formatFullDate,
  formatLongDate,
  formatPickerDate,
  formatTime,
  formatWeekdayShort,
  frequencySummary,
  nextOccurrences,
} from './recurrence.utils';

// Alarma de referencia del diseño: miércoles 26 de agosto de 2026, 9:00 AM
const START = new Date(2026, 7, 26, 9, 0);
const WEDNESDAYS: FrequencyConfig = { type: 'weekly', interval: 1, weekdays: [2] };

describe('nextOccurrences', () => {
  it('repite semanalmente el mismo día desde la fecha de inicio', () => {
    const dates = nextOccurrences(START, WEDNESDAYS, { type: 'never' }, 4);

    expect(dates).toEqual([
      new Date(2026, 7, 26, 9, 0),
      new Date(2026, 8, 2, 9, 0),
      new Date(2026, 8, 9, 9, 0),
      new Date(2026, 8, 16, 9, 0),
    ]);
  });

  it('combina varios días de la semana en orden cronológico', () => {
    const mondaysAndWednesdays: FrequencyConfig = { ...WEDNESDAYS, weekdays: [2, 0] };

    const dates = nextOccurrences(START, mondaysAndWednesdays, { type: 'never' }, 3);

    expect(dates).toEqual([
      new Date(2026, 7, 26, 9, 0),
      new Date(2026, 7, 31, 9, 0),
      new Date(2026, 8, 2, 9, 0),
    ]);
  });

  it('salta semanas cuando el intervalo es mayor que 1', () => {
    const everyTwoWeeks: FrequencyConfig = { ...WEDNESDAYS, interval: 2 };

    const dates = nextOccurrences(START, everyTwoWeeks, { type: 'never' }, 3);

    expect(dates).toEqual([
      new Date(2026, 7, 26, 9, 0),
      new Date(2026, 8, 9, 9, 0),
      new Date(2026, 8, 23, 9, 0),
    ]);
  });

  it('se detiene en la fecha de fin, incluyéndola', () => {
    const end = { type: 'onDate' as const, date: new Date(2026, 8, 9) };

    const dates = nextOccurrences(START, WEDNESDAYS, end, 10);

    expect(dates).toEqual([
      new Date(2026, 7, 26, 9, 0),
      new Date(2026, 8, 2, 9, 0),
      new Date(2026, 8, 9, 9, 0),
    ]);
  });

  it('no devuelve ocurrencias si no hay días seleccionados', () => {
    const noDays: FrequencyConfig = { ...WEDNESDAYS, weekdays: [] };

    expect(nextOccurrences(START, noDays, { type: 'never' }, 4)).toEqual([]);
  });
});

describe('frequencySummary', () => {
  it('describe un solo día semanal como "todos los …"', () => {
    expect(frequencySummary(WEDNESDAYS)).toBe('todos los miércoles');
  });

  it('enumera varios días en orden de la semana', () => {
    expect(frequencySummary({ ...WEDNESDAYS, weekdays: [2, 0] })).toBe('los lunes y miércoles');
    expect(frequencySummary({ ...WEDNESDAYS, weekdays: [4, 0, 2] })).toBe(
      'los lunes, miércoles y viernes',
    );
  });

  it('resume los días laborales como "de lunes a viernes"', () => {
    expect(frequencySummary({ ...WEDNESDAYS, weekdays: [0, 1, 2, 3, 4] })).toBe(
      'de lunes a viernes',
    );
  });

  it('resume los siete días como "todos los días"', () => {
    expect(frequencySummary({ ...WEDNESDAYS, weekdays: [0, 1, 2, 3, 4, 5, 6] })).toBe(
      'todos los días',
    );
  });

  it('antepone "cada N semanas" cuando el intervalo es mayor que 1', () => {
    expect(frequencySummary({ ...WEDNESDAYS, interval: 2 })).toBe('cada 2 semanas los miércoles');
    expect(frequencySummary({ type: 'weekly', interval: 3, weekdays: [0, 1, 2, 3, 4] })).toBe(
      'cada 3 semanas de lunes a viernes',
    );
  });
});

describe('endSummary', () => {
  it('indica "Nunca" cuando la recurrencia no termina', () => {
    expect(endSummary({ type: 'never' })).toBe('Nunca');
  });

  it('indica la fecha larga en la que se detiene', () => {
    expect(endSummary({ type: 'onDate', date: new Date(2026, 11, 16) })).toBe(
      'Se detendrá el 16 de diciembre de 2026',
    );
  });
});

describe('formatOccurrence', () => {
  it('formatea día, fecha y mes abreviados con año', () => {
    expect(formatOccurrence(START, true)).toBe('Mié. 26 ago. 2026');
  });

  it('omite el año cuando se pide', () => {
    expect(formatOccurrence(new Date(2026, 8, 2), false)).toBe('Mié. 2 sep.');
  });
});

describe('formatPickerDate', () => {
  it('formatea la fecha del encabezado del calendario', () => {
    // En el mockup dice "mar, 16 dic 2026", pero el 16 de diciembre de 2026 es miércoles
    expect(formatPickerDate(new Date(2026, 11, 16))).toBe('mié, 16 dic 2026');
    expect(formatPickerDate(new Date(2026, 8, 1))).toBe('mar, 1 sep 2026');
  });
});

describe('formatMonthYear', () => {
  it('formatea el mes visible del calendario con mayúscula inicial', () => {
    expect(formatMonthYear(new Date(2026, 11, 16))).toBe('Diciembre 2026');
  });
});

describe('formatTime', () => {
  it('formatea la hora en 12 horas con AM/PM, como el diseño', () => {
    expect(formatTime(new Date(2026, 7, 26, 9, 0))).toBe('9:00 AM');
    expect(formatTime(new Date(2026, 7, 26, 8, 5))).toBe('8:05 AM');
    expect(formatTime(new Date(2026, 7, 26, 14, 30))).toBe('2:30 PM');
  });

  it('usa 12 para el mediodía y la medianoche', () => {
    expect(formatTime(new Date(2026, 7, 26, 12, 0))).toBe('12:00 PM');
    expect(formatTime(new Date(2026, 7, 26, 0, 15))).toBe('12:15 AM');
  });
});

describe('formatLongDate', () => {
  it('formatea la fecha larga', () => {
    expect(formatLongDate(new Date(2026, 11, 16))).toBe('16 de diciembre de 2026');
  });
});

describe('formatFullDate', () => {
  it('antepone el día de la semana a la fecha larga', () => {
    expect(formatFullDate(new Date(2026, 7, 26))).toBe('Miércoles, 26 de agosto de 2026');
    expect(formatFullDate(new Date(2026, 7, 30))).toBe('Domingo, 30 de agosto de 2026');
  });
});

describe('formatWeekdayShort', () => {
  it('da el día abreviado sin punto (lista de alarmas)', () => {
    expect(formatWeekdayShort(new Date(2026, 7, 29))).toBe('Sáb');
    expect(formatWeekdayShort(new Date(2026, 7, 30))).toBe('Dom');
  });
});

describe('formatDuration', () => {
  it('formatea minutos como horas y minutos', () => {
    expect(formatDuration(130)).toBe('2h 10min');
    expect(formatDuration(45)).toBe('45min');
    expect(formatDuration(180)).toBe('3h');
  });
});
