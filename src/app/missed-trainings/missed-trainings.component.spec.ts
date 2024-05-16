import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedTrainingsComponent } from './missed-trainings.component';

describe('MissedTrainingsComponent', () => {
  let component: MissedTrainingsComponent;
  let fixture: ComponentFixture<MissedTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissedTrainingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissedTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
