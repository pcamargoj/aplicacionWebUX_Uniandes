import { Component, booleanAttribute, input } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

// Opción de una lista de radios con forma de tarjeta (WD14, WD15). Debe usarse dentro de un
// mat-radio-group: el grupo lleva el valor y el teclado.
@Component({
  selector: 'app-option-card',
  imports: [MatRadioModule],
  templateUrl: './option-card.html',
  styleUrl: './option-card.css',
})
export class OptionCard {
  readonly value = input.required<unknown>();
  readonly title = input.required<string>();
  readonly subtitle = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
}
