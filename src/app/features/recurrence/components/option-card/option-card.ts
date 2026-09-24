import { Component, booleanAttribute, inject, input } from '@angular/core';
import { MAT_RADIO_GROUP, MatRadioModule } from '@angular/material/radio';

// Opción de una lista de radios con forma de tarjeta (WD14, WD15). Debe usarse dentro de un
// mat-radio-group: el grupo lleva el valor y el teclado.
@Component({
  selector: 'app-option-card',
  imports: [MatRadioModule],
  templateUrl: './option-card.html',
  styleUrl: './option-card.css',
})
export class OptionCard {
  // El grupo busca sus radios con @ContentChildren y no ve los que están dentro de esta vista:
  // sin esto, un cambio de valor hecho desde código no marcaría la tarjeta.
  protected readonly group = inject(MAT_RADIO_GROUP);

  readonly value = input.required<unknown>();
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
}
