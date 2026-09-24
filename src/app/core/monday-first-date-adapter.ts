import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

// El diseño (WD15) muestra la semana de L a D. En CLDR, es-CO empieza en domingo.
@Injectable()
export class MondayFirstDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }

  // Intl da 'l m m j v s d' (dos "m"); el diseño usa mayúsculas y X para el miércoles
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'narrow'
      ? ['D', 'L', 'M', 'X', 'J', 'V', 'S']
      : super.getDayOfWeekNames(style);
  }
}
