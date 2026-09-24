import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface DetailField {
  label: string;
  value: string;
}

interface OccurrenceItem {
  dateLabel: string;
  timeLabel: string;
}

@Component({
  selector: 'app-alarm-detail',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './alarm-detail.html',
  styleUrl: './alarm-detail.css',
})
export class AlarmDetail {
  protected readonly alarmTitle = 'Reunión semanal de ventas';
  protected readonly isActive = true;
  protected readonly recurrenceLabel = 'Esta alarma se repite todos los miércoles';

  protected readonly details: DetailField[] = [
    { label: 'Fecha', value: 'Miércoles, 26 de agosto de 2026' },
    { label: 'Hora de la reunión', value: '9:00 AM' },
    { label: 'Lugar', value: 'Oficina principal' },
    { label: 'Transporte', value: 'Carro' },
    { label: 'Salida recomendada', value: '8:20 AM · Calculado con tráfico y clima actuales' },
    { label: 'Notas', value: 'Reunión semanal del equipo de ventas.' },
  ];

  protected readonly occurrences: OccurrenceItem[] = [
    { dateLabel: 'Mié. 26 ago. 2026', timeLabel: '9:00 AM' },
    { dateLabel: 'Mié. 2 sep. 2026', timeLabel: '9:00 AM' },
    { dateLabel: 'Mié. 9 sep. 2026', timeLabel: '9:00 AM' },
    { dateLabel: 'Mié. 16 sep. 2026', timeLabel: '9:00 AM' },
  ];

  protected readonly onTimeCount = 12;
  protected readonly totalCount = 12;
  protected readonly punctualityPercent = 100;

  constructor(
    private readonly location: Location,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  protected goBack(): void {
    this.location.back();
  }

  protected onEdit(): void {
    // pendiente: flujo de edición de alarma
  }

  protected onAddRecurrence(): void {
    this.router.navigate(['recurrencia'], { relativeTo: this.route });
  }

  protected onViewAllOccurrences(): void {
    // pendiente: vista completa de ocurrencias
  }
}
