import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { OptionCard } from '../../components/option-card/option-card';
import { RecurrenceDraftStore } from '../../recurrence-draft.store';
import { Weekday } from '../../recurrence.model';

interface FrequencyOption {
  value: string;
  title: string;
  subtitle: string;
  disabled: boolean;
}

// Solo "Semanalmente" está implementada; las demás se muestran deshabilitadas
const OPTIONS: FrequencyOption[] = [
  { value: 'daily', title: 'Todos los días', subtitle: 'Se repite cada día', disabled: true },
  {
    value: 'weekly',
    title: 'Semanalmente',
    subtitle: 'Se repite en días específicos de la semana',
    disabled: false,
  },
  { value: 'monthly', title: 'Mensualmente', subtitle: 'Se repite una vez al mes', disabled: true },
  {
    value: 'custom',
    title: 'Personalizar',
    subtitle: 'Define un intervalo a medida',
    disabled: true,
  },
];

const WEEKDAYS: { day: Weekday; letter: string; name: string }[] = [
  { day: 0, letter: 'L', name: 'Lunes' },
  { day: 1, letter: 'M', name: 'Martes' },
  { day: 2, letter: 'X', name: 'Miércoles' },
  { day: 3, letter: 'J', name: 'Jueves' },
  { day: 4, letter: 'V', name: 'Viernes' },
  { day: 5, letter: 'S', name: 'Sábado' },
  { day: 6, letter: 'D', name: 'Domingo' },
];

@Component({
  selector: 'app-recurrence-frequency',
  imports: [MatButtonModule, MatIconModule, MatRadioModule, OptionCard],
  templateUrl: './recurrence-frequency.html',
  styleUrls: ['../two-column-step.css', './recurrence-frequency.css'],
})
export class RecurrenceFrequency {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly store = inject(RecurrenceDraftStore);

  protected readonly options = OPTIONS;
  protected readonly weekdays = WEEKDAYS;
  protected readonly intervals = [1, 2, 3, 4];

  protected readonly frequency = computed(() => this.store.draft().frequency);
  protected readonly canContinue = computed(() => !!this.frequency()?.weekdays.length);

  protected isSelected(day: Weekday): boolean {
    return !!this.frequency()?.weekdays.includes(day);
  }

  protected onIntervalChange(event: Event): void {
    this.store.setWeekInterval(Number((event.target as HTMLSelectElement).value));
  }

  protected continue(): void {
    this.router.navigate(['../fin'], { relativeTo: this.route });
  }
}
