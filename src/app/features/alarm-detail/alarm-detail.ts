import { Component, computed, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AlarmsService } from '../../core/alarms.service';
import {
  formatFullDate,
  formatLongDate,
  formatOccurrence,
  formatTime,
  frequencySummary,
  nextOccurrences,
} from '../recurrence/recurrence.utils';

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
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './alarm-detail.html',
  styleUrl: './alarm-detail.css',
})
export class AlarmDetail {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly alarms = inject(AlarmsService);

  readonly id = input.required<string>();

  protected readonly alarm = computed(() => this.alarms.getById(this.id()));

  protected readonly details = computed<DetailField[]>(() => {
    const alarm = this.alarm();
    if (!alarm) return [];
    return [
      { label: 'Fecha', value: formatFullDate(alarm.meetingAt) },
      { label: 'Hora de la reunión', value: formatTime(alarm.meetingAt) },
      { label: 'Lugar', value: alarm.location },
      { label: 'Transporte', value: alarm.transport },
      {
        label: 'Salida recomendada',
        value: `${formatTime(alarm.departureAt)} · Calculado con tráfico y clima actuales`,
      },
      { label: 'Notas', value: alarm.notes },
    ];
  });

  // Solo si la alarma tiene recurrencia (se agrega con el flujo de recurrencia)
  protected readonly recurrenceLabel = computed(() => {
    const recurrence = this.alarm()?.recurrence;
    if (!recurrence) return null;
    const { frequency, end } = recurrence;
    const until = end.type === 'onDate' ? ` hasta el ${formatLongDate(end.date)}` : '';
    return `Esta alarma se repite ${frequencySummary(frequency)}${until}`;
  });

  protected readonly occurrences = computed<OccurrenceItem[]>(() => {
    const alarm = this.alarm();
    if (!alarm?.recurrence) return [];
    const { frequency, end } = alarm.recurrence;
    return nextOccurrences(alarm.meetingAt, frequency, end, 4).map((date) => ({
      dateLabel: formatOccurrence(date, true),
      timeLabel: formatTime(date),
    }));
  });

  protected readonly onTimeCount = 12;
  protected readonly totalCount = 12;
  protected readonly punctualityPercent = 100;

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
