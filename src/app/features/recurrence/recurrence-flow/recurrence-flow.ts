import { Component, OnInit, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { RecurrenceDraftStore } from '../recurrence-draft.store';
import { RecurrenceStepper } from '../components/recurrence-stepper/recurrence-stepper';

// Pasos con stepper; el 4 (éxito, WD17) no tiene ni stepper ni Volver
const STEPS = [
  { path: 'frecuencia', label: 'Frecuencia' },
  { path: 'fin', label: 'Hasta cuándo' },
  { path: 'confirmar', label: 'Confirmar' },
];

// Fecha de la alarma mock (miércoles 26 ago. 2026, 9:00 AM) hasta que exista AlarmsService
const ALARM_START = new Date(2026, 7, 26, 9, 0);

@Component({
  selector: 'app-recurrence-flow',
  imports: [RouterOutlet, MatIconModule, RecurrenceStepper],
  templateUrl: './recurrence-flow.html',
  styleUrl: './recurrence-flow.css',
})
export class RecurrenceFlow implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RecurrenceDraftStore);

  readonly id = input.required<string>();

  protected readonly stepLabels = STEPS.map((s) => s.label);

  // Número de paso según el `data.step` de la ruta hija activa
  protected readonly step = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.currentStep()),
    ),
    { initialValue: this.currentStep() },
  );

  ngOnInit(): void {
    this.store.init(this.id(), ALARM_START);
  }

  protected goBack(): void {
    const step = this.step();
    if (step <= 1) {
      this.router.navigate(['/alarmas', this.id()]);
    } else {
      this.router.navigate([STEPS[step - 2].path], { relativeTo: this.route });
    }
  }

  private currentStep(): number {
    return this.route.snapshot.firstChild?.data['step'] ?? 1;
  }
}
