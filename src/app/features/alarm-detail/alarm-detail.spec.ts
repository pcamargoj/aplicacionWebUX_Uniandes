import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmDetail } from './alarm-detail';

describe('AlarmDetail', () => {
  let component: AlarmDetail;
  let fixture: ComponentFixture<AlarmDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlarmDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlarmDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
