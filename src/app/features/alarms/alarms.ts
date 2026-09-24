import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Alarm, AlarmsService, TODAY } from '../../core/alarms.service';
import { formatTime, formatWeekdayShort } from '../recurrence/recurrence.utils';

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

  private readonly alarmsService = inject(AlarmsService);

  protected readonly alarms = computed(() => this.alarmsService.alarms().map(toAlarmItem));

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
    this.alarmsService.setEnabled(alarm.id, !alarm.enabled);
  }

  protected onCreateAlarm(): void {
    // pendiente: flujo de creación de alarma
  }
}

// Días de diferencia con "hoy" (TODAY), sin contar la hora
function daysFromToday(date: Date): number {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((day.getTime() - TODAY.getTime()) / 86_400_000);
}

function toAlarmItem(alarm: Alarm): AlarmItem {
  const days = daysFromToday(alarm.meetingAt);
  const time = formatTime(alarm.meetingAt);
  const category = days === 0 ? 'today' : days === 1 ? 'tomorrow' : 'later';
  const whenLabel =
    category === 'today'
      ? time
      : category === 'tomorrow'
        ? `Mañana · ${time}`
        : `${formatWeekdayShort(alarm.meetingAt)} · ${time}`;
  return {
    id: alarm.id,
    whenLabel,
    title: alarm.title,
    location: alarm.location,
    leaveAtLabel: `Sale a las ${formatTime(alarm.departureAt)}`,
    enabled: alarm.enabled,
    category,
  };
}
