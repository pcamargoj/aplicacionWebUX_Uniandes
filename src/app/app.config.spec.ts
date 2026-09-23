import { formatDate } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DateAdapter } from '@angular/material/core';

import { appConfig } from './app.config';

describe('appConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
  });

  it('usa el locale es-CO con sus datos registrados', () => {
    const locale = TestBed.inject(LOCALE_ID);

    expect(locale).toBe('es-CO');
    expect(formatDate(new Date(2026, 7, 26), 'MMMM', locale)).toBe('agosto');
  });

  it('configura el datepicker en español', () => {
    const adapter = TestBed.inject(DateAdapter);

    expect(adapter.getMonthNames('long')[7]).toBe('agosto');
  });

  it('empieza la semana del calendario en lunes', () => {
    expect(TestBed.inject(DateAdapter).getFirstDayOfWeek()).toBe(1);
  });
});
