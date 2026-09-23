import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

// El diseño (WD15) muestra la semana de L a D. En CLDR, es-CO empieza en domingo.
@Injectable()
export class MondayFirstDateAdapter extends NativeDateAdapter {
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
