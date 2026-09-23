import { EndRule, FrequencyConfig, Weekday } from './recurrence.model';

const WEEKDAY_PLURALS = [
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábados',
  'domingos',
];

const WEEKDAY_SHORT = ['Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.', 'Dom.'];

const MONTHS = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

const MONTHS_SHORT = [
  'ene.',
  'feb.',
  'mar.',
  'abr.',
  'may.',
  'jun.',
  'jul.',
  'ago.',
  'sep.',
  'oct.',
  'nov.',
  'dic.',
];

// Date.getDay() usa 0 = domingo; el modelo usa 0 = lunes
export function weekdayOf(date: Date): Weekday {
  return ((date.getDay() + 6) % 7) as Weekday;
}

export function nextOccurrences(
  start: Date,
  frequency: FrequencyConfig,
  end: EndRule,
  limit: number,
): Date[] {
  if (frequency.weekdays.length === 0) {
    return [];
  }
  const dates: Date[] = [];
  // Límite exclusivo: el día siguiente a la fecha de fin, a medianoche
  const until =
    end.type === 'onDate'
      ? new Date(end.date.getFullYear(), end.date.getMonth(), end.date.getDate() + 1)
      : null;
  const day = new Date(start);
  // Días transcurridos desde el lunes de la semana de inicio
  let offset = weekdayOf(start);
  while (dates.length < limit && (!until || day < until)) {
    const week = Math.floor(offset / 7);
    if (week % frequency.interval === 0 && frequency.weekdays.includes(weekdayOf(day))) {
      dates.push(new Date(day));
    }
    day.setDate(day.getDate() + 1);
    offset++;
  }
  return dates;
}

// ['lunes', 'miércoles', 'viernes'] → 'lunes, miércoles y viernes'
function joinWithY(items: string[]): string {
  return items.length === 1 ? items[0] : `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
}

export function frequencySummary(frequency: FrequencyConfig): string {
  const sorted = [...frequency.weekdays].sort((a, b) => a - b);
  if (frequency.interval === 1 && sorted.length === 1) {
    return `todos los ${WEEKDAY_PLURALS[sorted[0]]}`;
  }
  const prefix = frequency.interval > 1 ? `cada ${frequency.interval} semanas ` : '';
  return prefix + weekdaysPhrase(sorted);
}

function weekdaysPhrase(sorted: Weekday[]): string {
  if (sorted.length === 7) {
    return 'todos los días';
  }
  if (sorted.join() === '0,1,2,3,4') {
    return 'de lunes a viernes';
  }
  return `los ${joinWithY(sorted.map((d) => WEEKDAY_PLURALS[d]))}`;
}

export function endSummary(end: EndRule): string {
  if (end.type === 'never') {
    return 'Nunca';
  }
  const { date } = end;
  return `Se detendrá el ${date.getDate()} de ${MONTHS[date.getMonth()]} de ${date.getFullYear()}`;
}

// 'Mié. 26 ago. 2026' (confirmación y éxito) o 'Mié. 26 ago.' (próximas ocurrencias)
export function formatOccurrence(date: Date, withYear: boolean): string {
  const label = `${WEEKDAY_SHORT[weekdayOf(date)]} ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
  return withYear ? `${label} ${date.getFullYear()}` : label;
}
