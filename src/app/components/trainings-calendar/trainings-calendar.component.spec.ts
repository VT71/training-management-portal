import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingsCalendarComponent } from './trainings-calendar.component';

describe('TrainingsCalendarComponent', () => {
  let component: TrainingsCalendarComponent;
  let fixture: ComponentFixture<TrainingsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingsCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrainingsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
