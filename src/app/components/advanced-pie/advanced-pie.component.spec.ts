import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedPieComponent } from './advanced-pie.component';

describe('AdvancedPieComponent', () => {
  let component: AdvancedPieComponent;
  let fixture: ComponentFixture<AdvancedPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedPieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvancedPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
