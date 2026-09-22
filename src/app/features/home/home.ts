import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type StatusItemVariant = 'primary' | 'warn' | 'accent' | 'info';

interface StatusStripItem {
  icon: string;
  label: string;
  value: string;
  subLabel: string;
  variant: StatusItemVariant;
}

interface UpcomingAlarm {
  id: string;
  whenLabel: string;
  title: string;
  location: string;
  leaveAtLabel: string;
}

interface RouteSummary {
  trafficLabel: string;
  durationLabel: string;
  departureLabel: string;
}

interface WeeklyDayStat {
  day: string;
  value: number;
  highlighted?: boolean;
}

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected readonly userName = 'Pedro';

  protected readonly statusItems: StatusStripItem[] = [
    { icon: 'schedule', label: 'Próxima reunión', value: '3:00 PM', subLabel: 'Reunión con cliente', variant: 'info' },
    { icon: 'directions_walk', label: 'Debes salir en', value: '25 min', subLabel: 'Para llegar a tiempo', variant: 'warn' },
    { icon: 'directions_car', label: 'Tráfico en tu ruta', value: 'Moderado', subLabel: 'Av. El Poblado', variant: 'accent' },
    { icon: 'cloud', label: 'Clima actual', value: '24°C', subLabel: 'Lluvia ligera', variant: 'info' },
  ];

  protected readonly upcomingAlarms: UpcomingAlarm[] = [
    { id: '1', whenLabel: '3:00', title: 'Reunión con cliente', location: 'Av El Poblado #1-25', leaveAtLabel: 'Sale a las 2:20 PM' },
    { id: '2', whenLabel: '11:00 AM', title: 'Reunión interna', location: 'Oficina Principal', leaveAtLabel: 'Sale a las 10:30 AM' },
    { id: '3', whenLabel: 'Mañana', title: 'Presentación proyecto', location: 'Cliente Zona Sur', leaveAtLabel: 'Sale a las 8:40 AM' },
  ];

  protected readonly routeSummary: RouteSummary = {
    trafficLabel: 'Tráfico moderado',
    durationLabel: '40 min (12 km)',
    departureLabel: 'Salida recomendada: 2:20 PM · Tráfico moderado',
  };

  protected readonly weeklyStats: WeeklyDayStat[] = [
    { day: 'Lun', value: 45 },
    { day: 'Mar', value: 78 },
    { day: 'Mié', value: 55 },
    { day: 'Jue', value: 92, highlighted: true },
    { day: 'Vie', value: 65 },
  ];

  protected readonly hoursSavedLabel = '3h 20m';
  protected readonly punctualityPercent = 96;
  protected readonly activeAlarmsCount = 5;
  protected readonly mostUsedAlarm = 'Reunión con cliente';

  protected onCreateAlarm(): void {
    // pendiente: flujo de creación de alarma
  }
}
