import { Component, input } from '@angular/core';

import { formatOccurrence, formatTime } from '../../recurrence.utils';

// Tabla de próximas ocurrencias (WD16 2364:157, WD17 2365:140). Solo la primera tiene la
// salida calculada; las demás se calculan con el tráfico del día.
@Component({
  selector: 'app-occurrences-table',
  templateUrl: './occurrences-table.html',
  styleUrl: './occurrences-table.css',
})
export class OccurrencesTable {
  readonly dates = input.required<Date[]>();
  readonly departure = input.required<Date>();
  readonly timeHeader = input('Hora');

  protected readonly formatOccurrence = formatOccurrence;
  protected readonly formatTime = formatTime;
}
