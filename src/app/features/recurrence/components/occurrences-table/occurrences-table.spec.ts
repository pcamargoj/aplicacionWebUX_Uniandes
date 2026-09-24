import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccurrencesTable } from './occurrences-table';

describe('OccurrencesTable', () => {
  let fixture: ComponentFixture<OccurrencesTable>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = (e: Element) => e.textContent?.replace(/\s+/g, ' ').trim();
  const rows = () =>
    Array.from(el().querySelectorAll('tbody tr')).map((tr) =>
      Array.from(tr.querySelectorAll('td, th')).map(text),
    );

  beforeEach(() => {
    fixture = TestBed.createComponent(OccurrencesTable);
    fixture.componentRef.setInput('dates', [
      new Date(2026, 7, 26, 9, 0),
      new Date(2026, 8, 2, 9, 0),
      new Date(2026, 8, 9, 9, 0),
    ]);
    fixture.componentRef.setInput('departure', new Date(2026, 7, 26, 8, 20));
    fixture.detectChanges();
  });

  it('es una tabla con encabezados Fecha · Hora · Salida estimada', () => {
    expect(Array.from(el().querySelectorAll('thead th')).map(text)).toEqual([
      'Fecha',
      'Hora',
      'Salida estimada',
    ]);
  });

  it('muestra una fila por fecha con la hora de la reunión', () => {
    expect(rows()).toEqual([
      ['Mié. 26 ago. 2026', '9:00 AM', '8:20 AM'],
      ['Mié. 2 sep. 2026', '9:00 AM', 'Se calculará automáticamente'],
      ['Mié. 9 sep. 2026', '9:00 AM', 'Se calculará automáticamente'],
    ]);
  });

  it('resalta la salida de la primera ocurrencia', () => {
    const first = el().querySelector('tbody tr td:last-child')!;

    expect(first.classList).toContain('occurrences__departure--known');
  });

  it('permite cambiar el encabezado de la hora (WD17 usa "Reunión")', () => {
    fixture.componentRef.setInput('timeHeader', 'Reunión');
    fixture.detectChanges();

    expect(text(el().querySelectorAll('thead th')[1])).toBe('Reunión');
  });
});
