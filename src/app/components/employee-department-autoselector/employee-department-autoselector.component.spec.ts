import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDepartmentAutoselectorComponent } from './employee-department-autoselector.component';

describe('EmployeeDepartmentAutoselectorComponent', () => {
  let component: EmployeeDepartmentAutoselectorComponent;
  let fixture: ComponentFixture<EmployeeDepartmentAutoselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDepartmentAutoselectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmployeeDepartmentAutoselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
