import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';

import { CalendarHeader } from '../../components/calendar-header/calendar-header';
import { OptionCard } from '../../components/option-card/option-card';
import { RecurrenceDraftStore } from '../../recurrence-draft.store';
import { formatOccurrence, formatPickerDate } from '../../recurrence.utils';

type EndChoice = 'never' | 'onDate' | 'count';

@Component({
  selector: 'app-recurrence-end',
  imports: [MatButtonModule, MatDatepickerModule, MatRadioModule, OptionCard],
  templateUrl: './recurrence-end.html',
  styleUrls: ['../two-column-step.css', './recurrence-end.css'],
})
export class RecurrenceEnd {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(RecurrenceDraftStore);

  protected readonly calendarHeader = CalendarHeader;

  // Fecha de fin ya aceptada (la que está en el borrador)
  protected readonly endDate = computed(() => {
    const end = this.store.draft().end;
    return end.type === 'onDate' ? end.date : null;
  });

  protected readonly choice = signal<EndChoice>(this.endDate() ? 'onDate' : 'never');
  protected readonly calendarOpen = signal(false);
  // Fecha marcada en el calendario, pendiente de "Aceptar"
  protected readonly pendingDate = signal<Date | null>(null);

  protected readonly occurrences = computed(() =>
    this.store.nextOccurrences().map((date) => formatOccurrence(date, false)),
  );
  protected readonly canContinue = computed(() => this.choice() === 'never' || !!this.endDate());

  protected readonly formatPickerDate = formatPickerDate;

  protected onChoiceChange(choice: EndChoice): void {
    this.choice.set(choice);
    if (choice === 'never') {
      this.store.setEnd({ type: 'never' });
      this.calendarOpen.set(false);
    } else {
      this.openCalendar();
    }
  }

  protected openCalendar(): void {
    this.pendingDate.set(this.endDate());
    this.calendarOpen.set(true);
  }

  protected accept(): void {
    const date = this.pendingDate();
    if (date) {
      this.store.setEnd({ type: 'onDate', date });
      this.calendarOpen.set(false);
    }
  }

  protected cancel(): void {
    this.calendarOpen.set(false);
    if (!this.endDate()) {
      this.choice.set('never');
    }
  }

  protected continue(): void {
    this.router.navigate(['../confirmar'], { relativeTo: this.route });
  }
}
