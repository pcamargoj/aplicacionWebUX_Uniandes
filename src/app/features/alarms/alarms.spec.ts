import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Alarms } from './alarms';

describe('Alarms', () => {
  let component: Alarms;
  let fixture: ComponentFixture<Alarms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alarms],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Alarms);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
