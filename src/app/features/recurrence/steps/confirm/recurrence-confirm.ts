import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AlarmsService } from '../../../../core/alarms.service';
import { OccurrencesTable } from '../../components/occurrences-table/occurrences-table';
import { RecurrenceDraftStore } from '../../recurrence-draft.store';
import { formatLongDate, formatTime } from '../../recurrence.utils';

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

@Component({
  selector: 'app-recurrence-confirm',
  imports: [MatButtonModule, MatIconModule, OccurrencesTable],
  templateUrl: './recurrence-confirm.html',
  styleUrl: './recurrence-confirm.css',
})
export class RecurrenceConfirm {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RecurrenceDraftStore);

  // Todo sale del borrador y de la alarma (el mockup mezcla datos de dos alarmas).
  // Solo se llega a través del flujo, que ya validó que la alarma existe
  protected readonly alarm = inject(AlarmsService).getById(this.store.draft().alarmId)!;

  protected readonly repeats = computed(() => capitalize(this.store.summaryLabel()));
  protected readonly meetingTime = formatTime(this.alarm.meetingAt);
  protected readonly departureTime = formatTime(this.alarm.departureAt);
  protected readonly ends = computed(() => {
    const end = this.store.draft().end;
    return end.type === 'onDate' ? formatLongDate(end.date) : 'Nunca';
  });
  protected readonly occurrences = computed(() => this.store.nextOccurrences().slice(0, 3));

  protected back(): void {
    this.router.navigate(['../fin'], { relativeTo: this.route });
  }

  protected confirm(): void {
    this.store.confirm();
    // replaceUrl: desde la pantalla de éxito, "atrás" no vuelve a la confirmación
    this.router.navigate(['../listo'], { relativeTo: this.route, replaceUrl: true });
  }
}
