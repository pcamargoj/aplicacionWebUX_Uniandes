import { Component, computed, inject } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlarmsService } from '../../../../core/alarms.service';
import { OccurrencesTable } from '../../components/occurrences-table/occurrences-table';
import { RecurrenceDraftStore } from '../../recurrence-draft.store';

@Component({
  selector: 'app-recurrence-success',
  imports: [MatButtonModule, MatIconModule, OccurrencesTable],
  templateUrl: './recurrence-success.html',
  styleUrl: './recurrence-success.css',
})
export class RecurrenceSuccess {
  private readonly router = inject(Router);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly store = inject(RecurrenceDraftStore);

  // Solo se llega a través del flujo, que ya validó que la alarma existe
  protected readonly alarm = inject(AlarmsService).getById(this.store.draft().alarmId)!;
  protected readonly occurrences = computed(() => this.store.nextOccurrences());

  protected viewAllOccurrences(): void {
    // pendiente: vista completa de ocurrencias (igual que en AlarmDetail)
  }

  protected goToDetail(): void {
    this.router.navigate(['/alarmas', this.alarm.id]);
  }

  protected goToAlarms(): void {
    this.router.navigate(['/alarmas']);
  }

  protected shareAlarm(): void {
    const url = `${location.origin}/alarmas/${this.alarm.id}`;
    const copied = this.clipboard.copy(url);
    this.snackBar.open(copied ? 'Enlace copiado' : 'No se pudo copiar el enlace', undefined, {
      duration: 3000,
    });
  }
}
