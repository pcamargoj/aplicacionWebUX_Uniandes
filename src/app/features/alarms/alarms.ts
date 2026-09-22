import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

interface AlarmItem {
  id: string;
  whenLabel: string;
  title: string;
  location: string;
  leaveAtLabel: string;
  enabled: boolean;
  category: 'today' | 'tomorrow' | 'later';
}

type AlarmsTabKey = 'proximas' | 'hoy' | 'manana' | 'todas';

interface AlarmsTab {
  key: AlarmsTabKey;
  label: string;
}

@Component({
  selector: 'app-alarms',
  imports: [RouterLink, MatIconModule, MatButtonModule, MatSlideToggleModule],
  templateUrl: './alarms.html',
  styleUrl: './alarms.css',
})
export class Alarms {
  protected readonly tabs: AlarmsTab[] = [
    { key: 'proximas', label: 'Próximas' },
    { key: 'hoy', label: 'Hoy' },
    { key: 'manana', label: 'Mañana' },
    { key: 'todas', label: 'Todas' },
  ];

  protected readonly selectedTab = signal<AlarmsTabKey>('proximas');

  protected readonly alarms = signal<AlarmItem[]>([
    { id: '1', whenLabel: '8:30 AM', title: 'Reunión con cliente', location: 'Av El Poblado #1-25, Medellín', leaveAtLabel: 'Sale a las 2:00 PM', enabled: true, category: 'today' },
    { id: '2', whenLabel: '11:00 AM', title: 'Reunión interna', location: 'Oficina Principal', leaveAtLabel: 'Sale a las 10:30 AM', enabled: true, category: 'today' },
    { id: '3', whenLabel: 'Mañana · 8:00 AM', title: 'Presentación proyecto', location: 'Cliente Zona Sur', leaveAtLabel: 'Sale a las 7:20 AM', enabled: true, category: 'tomorrow' },
    { id: '4', whenLabel: '3:00 PM', title: 'Almuerzo con proveedor', location: 'Av El Poblado #1-25', leaveAtLabel: 'Sale a las 2:20 PM', enabled: true, category: 'today' },
    { id: '5', whenLabel: 'Sáb · 9:00 AM', title: 'Cita con el dentista', location: 'Clínica Norte', leaveAtLabel: 'Sale a las 8:30 AM', enabled: true, category: 'later' },
    { id: '6', whenLabel: 'Dom · 6:00 PM', title: 'Cena familiar', location: 'Casa de mis padres', leaveAtLabel: 'Sale a las 5:20 PM', enabled: true, category: 'later' },
  ]);

  protected readonly filteredAlarms = computed(() => {
    const tab = this.selectedTab();
    const alarms = this.alarms();
    if (tab === 'hoy') return alarms.filter((a) => a.category === 'today');
    if (tab === 'manana') return alarms.filter((a) => a.category === 'tomorrow');
    return alarms;
  });

  protected readonly activeAlarmsCount = 5;
  protected readonly nextDepartureLabel = '2h 10min';

  protected selectTab(tab: AlarmsTabKey): void {
    this.selectedTab.set(tab);
  }

  protected toggleAlarm(alarm: AlarmItem): void {
    this.alarms.update((items) =>
      items.map((item) => (item.id === alarm.id ? { ...item, enabled: !item.enabled } : item))
    );
  }

  protected onCreateAlarm(): void {
    // pendiente: flujo de creación de alarma
  }
}
