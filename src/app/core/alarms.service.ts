import { Injectable, signal } from '@angular/core';

import { EndRule, FrequencyConfig } from '../features/recurrence/recurrence.model';

export interface AlarmRecurrence {
  frequency: FrequencyConfig;
  end: EndRule;
}

export interface Alarm {
  id: string;
  title: string;
  location: string;
  transport: string;
  notes: string;
  meetingAt: Date;
  departureAt: Date;
  enabled: boolean;
  recurrence: AlarmRecurrence | null;
}

// "Ahora" del prototipo: el día de la alarma de WD13, a las 6:10 AM (la próxima salida,
// 8:20 AM, queda a 2h 10min como en WD08). La app no tiene backend ni reloj real.
export const NOW = new Date(2026, 7, 26, 6, 10);
export const TODAY = new Date(2026, 7, 26);

const at = (day: number, hours: number, minutes = 0) => new Date(2026, 7, day, hours, minutes);

// La 1 es la alarma del detalle en Figma (WD13); las demás son las de "Mis alarmas" (WD08)
const ALARMS: Alarm[] = [
  {
    id: '1',
    title: 'Reunión semanal de ventas',
    location: 'Oficina principal',
    transport: 'Carro',
    notes: 'Reunión semanal del equipo de ventas.',
    meetingAt: at(26, 9),
    departureAt: at(26, 8, 20),
    enabled: true,
    recurrence: null,
  },
  {
    id: '2',
    title: 'Reunión interna',
    location: 'Oficina Principal',
    transport: 'Carro',
    notes: 'Revisión de pendientes del equipo.',
    meetingAt: at(26, 11),
    departureAt: at(26, 10, 30),
    enabled: true,
    recurrence: null,
  },
  {
    id: '3',
    title: 'Presentación proyecto',
    location: 'Cliente Zona Sur',
    transport: 'Carro',
    notes: 'Llevar la presentación y el portátil.',
    meetingAt: at(27, 8),
    departureAt: at(27, 7, 20),
    enabled: true,
    recurrence: null,
  },
  {
    id: '4',
    title: 'Almuerzo con proveedor',
    location: 'Av El Poblado #1-25',
    transport: 'Taxi',
    notes: 'Revisar la propuesta de precios antes del almuerzo.',
    meetingAt: at(26, 15),
    departureAt: at(26, 14, 20),
    enabled: true,
    recurrence: null,
  },
  {
    id: '5',
    title: 'Cita con el dentista',
    location: 'Clínica Norte',
    transport: 'Bus',
    notes: 'Control semestral.',
    meetingAt: at(29, 9),
    departureAt: at(29, 8, 30),
    enabled: true,
    recurrence: null,
  },
  {
    id: '6',
    title: 'Cena familiar',
    location: 'Casa de mis padres',
    transport: 'Carro',
    notes: 'Llevar el postre.',
    meetingAt: at(30, 18),
    departureAt: at(30, 17, 20),
    enabled: true,
    recurrence: null,
  },
];

// Datos mock en memoria (sin backend): se reinician al recargar la página
@Injectable({ providedIn: 'root' })
export class AlarmsService {
  private readonly state = signal<Alarm[]>(ALARMS);

  readonly alarms = this.state.asReadonly();

  getById(id: string): Alarm | undefined {
    return this.state().find((alarm) => alarm.id === id);
  }

  setEnabled(id: string, enabled: boolean): void {
    this.update(id, { enabled });
  }

  setRecurrence(id: string, recurrence: AlarmRecurrence): void {
    this.update(id, { recurrence });
  }

  private update(id: string, changes: Partial<Alarm>): void {
    this.state.update((alarms) =>
      alarms.map((alarm) => (alarm.id === id ? { ...alarm, ...changes } : alarm)),
    );
  }
}
