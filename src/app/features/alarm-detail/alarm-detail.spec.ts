import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AlarmsService } from '../../core/alarms.service';
import { AlarmDetail } from './alarm-detail';

describe('AlarmDetail', () => {
  let fixture: ComponentFixture<AlarmDetail>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = (e: Element | null | undefined) => e?.textContent?.replace(/\s+/g, ' ').trim();
  const field = (label: string) =>
    text(
      Array.from(el().querySelectorAll('.alarm-detail__field'))
        .find((f) => text(f.querySelector('dt')) === label)
        ?.querySelector('dd'),
    );

  function render(id: string) {
    fixture = TestBed.createComponent(AlarmDetail);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmDetail],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra los datos de la alarma pedida', () => {
    render('2');

    expect(text(el().querySelector('h1'))).toBe('Reunión interna');
    expect(text(el().querySelector('.alarm-detail__status'))).toBe('Activa');
    expect(field('Fecha')).toBe('Miércoles, 26 de agosto de 2026');
    expect(field('Hora de la reunión')).toBe('11:00 AM');
    expect(field('Lugar')).toBe('Oficina Principal');
    expect(field('Transporte')).toBe('Carro');
    expect(field('Salida recomendada')).toBe('10:30 AM · Calculado con tráfico y clima actuales');
    expect(field('Notas')).toBe('Revisión de pendientes del equipo.');
  });

  it('sin recurrencia no muestra la recurrencia, las ocurrencias ni las estadísticas', () => {
    render('1');

    expect(el().querySelector('.alarm-detail__recurrence')).toBeNull();
    expect(el().textContent).not.toContain('Próximas ocurrencias');
    expect(el().querySelector('.alarm-detail__stats')).toBeNull();
  });

  it('con recurrencia la describe y lista las próximas ocurrencias', () => {
    TestBed.inject(AlarmsService).setRecurrence('1', {
      frequency: { type: 'weekly', interval: 1, weekdays: [2] },
      end: { type: 'onDate', date: new Date(2026, 11, 16) },
    });
    render('1');

    expect(text(el().querySelector('.alarm-detail__recurrence'))).toContain(
      'Esta alarma se repite todos los miércoles hasta el 16 de diciembre de 2026',
    );
    expect(
      Array.from(el().querySelectorAll('.alarm-detail__occurrence')).map((o) =>
        Array.from(o.querySelectorAll('span')).map(text),
      ),
    ).toEqual([
      ['Mié. 26 ago. 2026', '9:00 AM'],
      ['Mié. 2 sep. 2026', '9:00 AM'],
      ['Mié. 9 sep. 2026', '9:00 AM'],
      ['Mié. 16 sep. 2026', '9:00 AM'],
    ]);
    expect(el().querySelector('.alarm-detail__stats')).toBeTruthy();
  });

  it('muestra "Inactiva" si la alarma está desactivada', () => {
    TestBed.inject(AlarmsService).setEnabled('1', false);
    render('1');

    expect(text(el().querySelector('.alarm-detail__status'))).toBe('Inactiva');
  });

  it('avisa si la alarma no existe', () => {
    render('999');

    expect(text(el().querySelector('h1'))).toBe('No encontramos esta alarma');
    expect(el().querySelector('a[href="/alarmas"]')).toBeTruthy();
  });
});
