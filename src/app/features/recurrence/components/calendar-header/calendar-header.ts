import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import { formatMonthYear, formatPickerDate } from '../../recurrence.utils';

// Encabezado de mat-calendar según WD15: overline + fecha elegida, y navegación de mes
@Component({
  selector: 'app-calendar-header',
  imports: [MatIconModule],
  templateUrl: './calendar-header.html',
  styleUrl: './calendar-header.css',
})
export class CalendarHeader {
  private readonly calendar = inject<MatCalendar<Date>>(MatCalendar);
  private readonly adapter = inject<DateAdapter<Date>>(DateAdapter);

  constructor() {
    const cdr = inject(ChangeDetectorRef);
    this.calendar.stateChanges.pipe(takeUntilDestroyed()).subscribe(() => cdr.markForCheck());
  }

  protected get dateLabel(): string {
    const selected = this.calendar.selected;
    return selected instanceof Date ? formatPickerDate(selected) : 'Sin fecha';
  }

  protected get monthLabel(): string {
    return formatMonthYear(this.calendar.activeDate);
  }

  protected get isFirstMonth(): boolean {
    const min = this.calendar.minDate;
    const active = this.calendar.activeDate;
    return (
      !!min &&
      active.getFullYear() * 12 + active.getMonth() <= min.getFullYear() * 12 + min.getMonth()
    );
  }

  protected previousMonth(): void {
    this.calendar.activeDate = this.adapter.addCalendarMonths(this.calendar.activeDate, -1);
  }

  protected nextMonth(): void {
    this.calendar.activeDate = this.adapter.addCalendarMonths(this.calendar.activeDate, 1);
  }
}
