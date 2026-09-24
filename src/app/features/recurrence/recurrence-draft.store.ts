import { Injectable, computed, inject, signal } from '@angular/core';
import { AlarmsService } from '../../core/alarms.service';
import { EndRule, FrequencyConfig, RecurrenceDraft, Weekday } from './recurrence.model';
import { endSummary, frequencySummary, nextOccurrences, weekdayOf } from './recurrence.utils';

// Borrador del flujo de recurrencia. Se provee en la ruta del flujo: vive mientras dura y se
// reinicia al salir.
@Injectable()
export class RecurrenceDraftStore {
  private readonly alarms = inject(AlarmsService);

  private readonly state = signal<RecurrenceDraft>({
    alarmId: '',
    frequency: null,
    end: { type: 'never' },
  });
  private readonly start = signal<Date | null>(null);
  private readonly isConfirmed = signal(false);

  readonly draft = this.state.asReadonly();
  readonly alarmStart = this.start.asReadonly();
  readonly confirmed = this.isConfirmed.asReadonly();

  readonly summaryLabel = computed(() => {
    const frequency = this.state().frequency;
    return frequency ? frequencySummary(frequency) : '';
  });

  readonly endLabel = computed(() => endSummary(this.state().end));

  readonly nextOccurrences = computed(() => {
    const { frequency, end } = this.state();
    const start = this.start();
    return frequency && start ? nextOccurrences(start, frequency, end, 4) : [];
  });

  init(alarmId: string, alarmStart: Date): void {
    this.start.set(alarmStart);
    this.isConfirmed.set(false);
    this.state.set({
      alarmId,
      frequency: { type: 'weekly', interval: 1, weekdays: [weekdayOf(alarmStart)] },
      end: { type: 'never' },
    });
  }

  toggleWeekday(day: Weekday): void {
    this.updateFrequency((frequency) => ({
      ...frequency,
      weekdays: frequency.weekdays.includes(day)
        ? frequency.weekdays.filter((d) => d !== day)
        : [...frequency.weekdays, day],
    }));
  }

  setWeekInterval(interval: number): void {
    this.updateFrequency((frequency) => ({ ...frequency, interval }));
  }

  setEnd(end: EndRule): void {
    this.state.update((draft) => ({ ...draft, end }));
  }

  confirm(): void {
    const { alarmId, frequency, end } = this.state();
    if (frequency) {
      this.alarms.setRecurrence(alarmId, { frequency, end });
    }
    this.isConfirmed.set(true);
  }

  private updateFrequency(change: (frequency: FrequencyConfig) => FrequencyConfig): void {
    this.state.update((draft) =>
      draft.frequency ? { ...draft, frequency: change(draft.frequency) } : draft,
    );
  }
}
