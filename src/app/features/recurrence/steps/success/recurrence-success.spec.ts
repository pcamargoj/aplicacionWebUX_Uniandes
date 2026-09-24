import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { appConfig } from '../../../../app.config';

describe('RecurrenceSuccess (WD17)', () => {
  let harness: RouterTestingHarness;

  const page = () =>
    harness.fixture.nativeElement.querySelector('app-recurrence-success') as HTMLElement;
  const text = (el: Element | null | undefined) => el?.textContent?.replace(/\s+/g, ' ').trim();
  const button = (label: string) =>
    Array.from(page().querySelectorAll('button')).find((b) => text(b)?.includes(label))!;

  async function click(label: string) {
    button(label).click();
    harness.fixture.detectChanges();
    await harness.fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ providers: appConfig.providers });
    harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/alarmas/1/recurrencia');
    await harness.navigateByUrl('/alarmas/1/recurrencia/listo');
  });

  it('confirma que la recurrencia se agregó, con su resumen', () => {
    expect(text(page().querySelector('h1'))).toBe('¡Recurrencia agregada!');
    expect(text(page().querySelector('.success__subtitle'))).toBe(
      'Tu alarma ahora se repetirá todos los miércoles.',
    );
  });

  it('lista las próximas 4 reuniones con la columna "Reunión"', () => {
    const table = page().querySelector('app-occurrences-table')!;

    expect(text(table.querySelectorAll('thead th')[1])).toBe('Reunión');
    expect(table.querySelectorAll('tbody tr').length).toBe(4);
  });

  it('"Volver al detalle" lleva al detalle de la alarma', async () => {
    await click('Volver al detalle');

    expect(TestBed.inject(Router).url).toBe('/alarmas/1');
  });

  it('"Ir a mis alarmas" lleva a la lista de alarmas', async () => {
    await click('Ir a mis alarmas');

    expect(TestBed.inject(Router).url).toBe('/alarmas');
  });

  it('copia el enlace de la alarma y lo avisa', async () => {
    const copy = spyOn(TestBed.inject(Clipboard), 'copy').and.returnValue(true);

    await click('Compartir enlace de la alarma');

    expect(copy).toHaveBeenCalledWith(`${location.origin}/alarmas/1`);
    expect(text(document.querySelector('.mat-mdc-snack-bar-label'))).toBe('Enlace copiado');
  });

  it('avisa si no se pudo copiar el enlace', async () => {
    spyOn(TestBed.inject(Clipboard), 'copy').and.returnValue(false);

    await click('Compartir enlace de la alarma');

    expect(text(document.querySelector('.mat-mdc-snack-bar-label'))).toBe(
      'No se pudo copiar el enlace',
    );
  });
});
