import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  model,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingsService } from '../../services/trainings.service';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, Subscription, catchError, finalize, map, of } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TrainingComplete } from '../../interfaces/training-complete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Department } from '../../interfaces/department';
import { EmployeeComplete } from '../../interfaces/employee-complete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { Sections } from '../../interfaces/sections';
import { SectionProgress } from '../../interfaces/section-progress';
import { ProgressApiService } from '../../services/progress-api.service';

@Component({
  selector: 'app-training-page',
  standalone: true,
  providers: [provideNativeDateAdapter()],
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
    MatDatepickerModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    FormsModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: './training-page.component.html',
  styleUrl: './training-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingPageComponent implements OnInit, AfterViewInit, OnDestroy {
  public trainingsDropDownOpen = false;
  public trainingId: number;
  public training!: TrainingComplete;
  private trainingSubscription$!: Subscription;
  public sectionsProgress: SectionProgress[] = [];
  public sectionsProgressSubscription$!: Subscription;
  public selectedSection!: Sections;
  public loading: boolean = true; // Indicator pentru încărcarea datelor
  public errorLoading: boolean = false; // Indicator pentru eroare la încărcare
  departments: Department[] = []; // Array pentru departamente
  employees: EmployeeComplete[] = []; // Array pentru angajați complete
  dataSource1: MatTableDataSource<Department>;
  dataSource2: MatTableDataSource<EmployeeComplete>;
  accordion = viewChild.required(MatAccordion);
  readonly checked = model(false);

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort2') sort2!: MatSort;

  public showDepartmentsTable: boolean = false;
  public showEmployeeTable: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingsService,
    private progressApiService: ProgressApiService,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router
  ) {
    this.dataSource1 = new MatTableDataSource<Department>([]);
    this.dataSource2 = new MatTableDataSource<EmployeeComplete>([]);
    const id = this.route.snapshot.paramMap.get('id');
    this.trainingId = id ? +id : 0;
    this.loading = false;
  }

  public ngOnInit(): void {
    this.loadTraining();
  }

  public ngAfterViewInit() {
    if (this.showDepartmentsTable) {
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
    }

    if (this.showEmployeeTable) {
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    }
  }

  public openDescription(): void {
    this.trainingsDropDownOpen = !this.trainingsDropDownOpen;
  }

  public applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  public applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  public loadTraining(): void {
    this.trainingSubscription$ = this.trainingService
      .getTrainingById(this.trainingId)
      .subscribe({
        next: (training) => {
          if (training) {
            this.training = training;

            this.dataSource1.data = training.departments;
            this.dataSource2.data = training.employees;

            this.showDepartmentsTable = training.departments.length > 0;
            this.showEmployeeTable = training.employees.length > 0;

            if (this.showDepartmentsTable) {
              this.dataSource1.paginator = this.paginator1;
              this.dataSource1.sort = this.sort1;
            }

            if (this.showEmployeeTable) {
              this.dataSource2.paginator = this.paginator2;
              this.dataSource2.sort = this.sort2;
            }

            if (training.sections.length > 0) {
              this.selectedSection = training.sections[0];
            }
          }
        },
        complete: () => {
          this.loading = false;
          this.changeDetectorRefs.detectChanges();
        },
      });

    const sessionAuthUser = sessionStorage.getItem('authUser');
    if (sessionAuthUser) {
      const objSessionAuthUser = JSON.parse(sessionAuthUser);
      if (objSessionAuthUser?.uid) {
        this.sectionsProgressSubscription$ = this.progressApiService
          .getAllProgressByUserTraining(
            objSessionAuthUser?.uid,
            this.trainingId
          )
          .subscribe({
            next: (sectionsProgress) => {
              if (sectionsProgress) {
                this.sectionsProgress = sectionsProgress;
              }
            },
            error: (error) => {
              alert('Error loading sections progress');
            },
          });
      }
    }
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

  public toggleDepartmentsTable(): void {
    this.showDepartmentsTable = !this.showDepartmentsTable;
    if (this.showDepartmentsTable) {
      this.changeDetectorRefs.detectChanges();
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
    }
  }

  public toggleEmployeeTable(): void {
    this.showEmployeeTable = !this.showEmployeeTable;
    if (this.showEmployeeTable) {
      this.changeDetectorRefs.detectChanges();
      this.dataSource2.paginator = this.paginator2;
      this.dataSource2.sort = this.sort2;
    }
  }

  public goToDepartment() {
    this.router.navigate(['dashboard/departments']);
  }

  public goToEmployee(employeeId: string) {
    this.router.navigate(['dashboard/employee', employeeId]);
  }

  public closeEmployeeTable(): void {
    this.showEmployeeTable = false;
  }

  public closeDepartmentsTable(): void {
    this.showDepartmentsTable = false;
  }

  onSectionClick(section: Sections) {
    this.selectedSection = section;
  }

  getProgressBySectionId(sectionId: number): number {
    const sectionProgress = this.sectionsProgress.find(
      (sp) => sp.sectionId === sectionId
    );
    if (sectionProgress) {
      return sectionProgress.progress;
    }
    return 0;
  }

  ngOnDestroy(): void {
    if (this.trainingSubscription$) {
      this.trainingSubscription$.unsubscribe();
    }
    if (this.sectionsProgressSubscription$) {
      this.sectionsProgressSubscription$.unsubscribe();
    }
  }
}
