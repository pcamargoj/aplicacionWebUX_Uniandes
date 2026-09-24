import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recurrence-stepper',
  imports: [MatIconModule],
  templateUrl: './recurrence-stepper.html',
  styleUrl: './recurrence-stepper.css',
})
export class RecurrenceStepper {
  readonly steps = input.required<string[]>();
  // Paso actual, empezando en 1
  readonly current = input.required<number>();
}
