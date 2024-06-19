import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { EmployeeComplete } from '../../interfaces/employee-complete';
import { EmployeesApiService } from '../../services/employees-api.service';

@Component({
  selector: 'app-employee-page',
  standalone: true,
  imports: [MatTabsModule, AsyncPipe],
  templateUrl: './employee-page.component.html',
  styleUrl: './employee-page.component.css',
})
export class EmployeePageComponent implements OnInit {
  @Input() id!: number;

  private employeeApiService = inject(EmployeesApiService);

  public employeeData$!: Observable<EmployeeComplete>;

  ngOnInit() {
    if (this.id) {
      this.employeeData$ = this.employeeApiService.getEmployeeComplete(this.id);
    }
  }
}
