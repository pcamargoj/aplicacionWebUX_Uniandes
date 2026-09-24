import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  afterNextRender,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { AlarmsService } from '../../../core/alarms.service';
import { RecurrenceDraftStore } from '../recurrence-draft.store';
import { RecurrenceStepper } from '../components/recurrence-stepper/recurrence-stepper';

// Pasos con stepper; el 4 (éxito, WD17) no tiene ni stepper ni Volver
const STEPS = [
  { path: 'frecuencia', label: 'Frecuencia' },
  { path: 'fin', label: 'Hasta cuándo' },
  { path: 'confirmar', label: 'Confirmar' },
];

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
  private readonly alarms = inject(AlarmsService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

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

  constructor() {
    // Al cambiar de paso, el foco pasa al título del paso nuevo para que el lector de
    // pantalla lo anuncie (si no, queda en el botón que ya desapareció)
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => afterNextRender(() => this.focusStepTitle(), { injector: this.injector }));
  }

  ngOnInit(): void {
    const alarm = this.alarms.getById(this.id());
    if (!alarm) {
      this.router.navigate(['/alarmas']);
      return;
    }
    this.store.init(alarm.id, alarm.meetingAt);
  }

  protected goBack(): void {
    const step = this.step();
    if (step <= 1) {
      this.router.navigate(['/alarmas', this.id()]);
    } else {
      this.router.navigate([STEPS[step - 2].path], { relativeTo: this.route });
    }
  }

  private focusStepTitle(): void {
    const title = this.host.nativeElement.querySelector<HTMLElement>('.flow__main h1');
    if (title) {
      title.tabIndex = -1;
      title.focus();
    }
  }

  private currentStep(): number {
    return this.route.snapshot.firstChild?.data['step'] ?? 1;
  }
}
