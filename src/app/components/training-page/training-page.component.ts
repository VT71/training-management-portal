import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TrainingsService } from '../../services/trainings.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TrainingComplete } from '../../interfaces/training-complete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Department } from '../../interfaces/department';
import { EmployeeComplete } from '../../interfaces/employee-complete';

@Component({
  selector: 'app-training-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatTableModule,
    MatFormFieldModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.css',
})
export class TrainingPageComponent implements OnInit, AfterViewInit {
  public trainingId: number;
  public training!: Observable<TrainingComplete>;
  public loading: boolean = true; // Indicator pentru încărcarea datelor
  public errorLoading: boolean = false; // Indicator pentru eroare la încărcare
  departments: Department[] = []; // Array pentru departamente
  employees: EmployeeComplete[] = []; // Array pentru angajați complete
  dataSource1: MatTableDataSource<Department>;
  dataSource2: MatTableDataSource<EmployeeComplete>;

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort2') sort2!: MatSort;

  public showDepartmentsTable: boolean = false;
  public showEmployeeTable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingsService,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router
  ) {
    this.dataSource1 = new MatTableDataSource<Department>([]);
    this.dataSource2 = new MatTableDataSource<EmployeeComplete>([]);
    const id = this.route.snapshot.paramMap.get('id');
    this.trainingId = id ? +id : 0;
    this.loading = false;
  }

  ngAfterViewInit() {
    if (this.showDepartmentsTable) {
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
    }

    if (this.showEmployeeTable) {
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    }
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  loadTraining(): void {
    this.training = this.trainingService.getTrainingById(this.trainingId);
    this.training.subscribe({
      next: (training) => {
        this.dataSource1.data = training.departments;
        this.dataSource2.data = training.employees;
      },
      error: (error) => {
        console.error(
          'Eroare la încărcarea detaliilor despre training:',
          error
        );
      },
    });
  }

  ngOnInit(): void {
    this.loadTraining();

    console.log('Employees:', this.employees);
    console.log('Depertments:', this.dataSource1);
  }

  public convertDate(date: string): string {
    if (date) {
      return (
        date.slice(11, 16) +
        ' ' +
        date.slice(0, 10).split('-').reverse().join('-').replaceAll('-', '/')
      );
    } else {
      return '';
    }
  }

  toggleDepartmentsTable(): void {
    this.showDepartmentsTable = !this.showDepartmentsTable;
    if (this.showDepartmentsTable) {
      this.changeDetectorRefs.detectChanges();
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
    }
  }

  toggleEmployeeTable(): void {
    this.showEmployeeTable = !this.showEmployeeTable;
    if (this.showEmployeeTable) {
      this.changeDetectorRefs.detectChanges();
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    }
  }

  goToDepartment() {
    this.router.navigate(['dashboard/departments']);
  }

  goToEmployee(employeeId: string) {
    this.router.navigate(['dashboard/employee', employeeId]);
  }

  public convertNumberToYesNo(value: number): string {
    return value === 1 ? 'Yes' : 'No';
  }

  public closeEmployeeTable(): void {
    this.showEmployeeTable = false;
  }

  public closeDepartmentsTable(): void {
    this.showDepartmentsTable = false;
  }
}
