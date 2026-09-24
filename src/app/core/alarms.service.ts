import { Injectable } from '@angular/core';

export interface Alarm {
  id: string;
  title: string;
  meetingAt: Date;
  departureAt: Date;
}

// Datos mock (sin backend). Por ahora toda alarma es la del detalle (WD13), como hace
// AlarmDetail; la lista de Mis alarmas se conecta aquí más adelante.
@Injectable({ providedIn: 'root' })
export class AlarmsService {
  getById(id: string): Alarm {
    return {
      id,
      title: 'Reunión semanal de ventas',
      meetingAt: new Date(2026, 7, 26, 9, 0),
      departureAt: new Date(2026, 7, 26, 8, 20),
    };
  }
}
