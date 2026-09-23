// 0 = lunes … 6 = domingo (orden L M X J V S D)
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Solo se implementa la frecuencia semanal; las demás opciones se muestran deshabilitadas.
export interface FrequencyConfig {
  type: 'weekly';
  interval: number;
  weekdays: Weekday[];
}

export type EndRule = { type: 'never' } | { type: 'onDate'; date: Date };

export interface RecurrenceDraft {
  alarmId: string;
  frequency: FrequencyConfig | null;
  end: EndRule;
}
