import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Signal,
  ViewChild,
  WritableSignal,
  model,
  signal,
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
import {
  Observable,
  Subscription,
  catchError,
  concatMap,
  finalize,
  map,
  of,
  tap,
} from 'rxjs';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { DialogContentExampleDialog } from '../calendar/dialog-component/dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { ConfirmDialogComponent } from '../navbar/confirm-add-dialog.component';

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
  private userId!: string;
  public trainingId: number;
  private training!: TrainingComplete;
  public training$!: Observable<TrainingComplete>;
  public sectionsProgress: SectionProgress[] = [];
  public sectionProgress$!: Observable<SectionProgress[]>;
  public sectionIndex: WritableSignal<number> = signal(-1);
  private updateProgressSubscription!: Subscription;

  public loading: boolean = true; // Indicator pentru încărcarea datelor
  public errorLoading: boolean = false; // Indicator pentru eroare la încărcare

  departments: Department[] = []; // Array pentru departamente
  employees: EmployeeComplete[] = []; // Array pentru angajați complete
  dataSource1: MatTableDataSource<Department>;
  dataSource2: MatTableDataSource<EmployeeComplete>;
  accordion = viewChild.required(MatAccordion);
  readonly checked = model(false);
  public adminVersion = false;

  @Output() valuesEmitter = new EventEmitter<number>();
  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('sort1') sort1!: MatSort;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  @ViewChild('sort2') sort2!: MatSort;

  public showDepartmentsTable: boolean = false;
  public showEmployeeTable: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private trainingService: TrainingsService,
    private progressApiService: ProgressApiService,
    private authService: AuthService,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.dataSource1 = new MatTableDataSource<Department>([]);
    this.dataSource2 = new MatTableDataSource<EmployeeComplete>([]);
    const id = this.route.snapshot.paramMap.get('id');
    this.trainingId = id ? +id : 0;
    this.loading = false;
  }

  public ngOnInit(): void {
    const sessionAuthUser = sessionStorage.getItem('authUser');
    if (sessionAuthUser) {
      const objSessionAuthUser = JSON.parse(sessionAuthUser);
      if (objSessionAuthUser?.uid) {
        this.userId = objSessionAuthUser?.uid;
        this.loadTraining(objSessionAuthUser?.uid);
      } else {
        alert('User not found');
      }
    } else {
      alert('User not found');
    }
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

  public loadTraining(userId: string): void {
    this.training$ = this.trainingService.getTrainingById(this.trainingId).pipe(
      concatMap((training) => {
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
            this.sectionIndex.update(() => 0);
          }
        }
        return this.progressApiService
          .getAllProgressByUserTraining(userId, this.trainingId)
          .pipe(
            map((sectionsProgres) => {
              if (sectionsProgres) {
                this.sectionsProgress = sectionsProgres;
                if (training.sections[0]) {
                  return {
                    training,
                    progress: this.getProgressBySectionId(
                      training.sections[0].sectionId
                    ),
                  };
                }
              }
              return { training, progress: 0 };
            })
          );
      }),
      concatMap(({ training, progress }) => {
        if (progress === -1 && training.sections[0]) {
          return this.progressApiService
            .updateProgress(training.sections[0].sectionId, userId, 0)
            .pipe(
              map(() => {
                this.sectionsProgress.push({
                  sectionId: training.sections[0].sectionId,
                  progress: 0,
                  progressId: 0,
                  employeeId: 0,
                });
                return training;
              })
            );
        }
        return of(training);
      }),
      concatMap((training) => {
        return this.authService.rolesource.pipe(
          map((role) => {
            if (role === 'admin') {
              this.adminVersion = true;
            } else {
              this.adminVersion = false;
              this.showDepartmentsTable = false;
                this.showEmployeeTable = false;
            }
            return training;
          })
        );
      })
    );
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

  onSectionClick(section: Sections, index: number) {
    this.sectionIndex.update(() => index);
    // if (this.getProgressBySectionId(section.sectionId) === -1) {
    //   this.updateSectionProgress(section, 0, 'initial');
    // }
  }

  updateSectionProgress(section: Sections, progress: number, type: string) {
    if (this.userId) {
      if (this.getProgressBySectionId(section.sectionId) !== progress) {
        this.updateProgressSubscription = this.progressApiService
          .updateProgress(section.sectionId, this.userId, progress)
          .subscribe({
            next: () => {
              const sectionProgressIndex = this.sectionsProgress.findIndex(
                (sp) => sp.sectionId === section.sectionId
              );
              if (sectionProgressIndex !== -1) {
                this.sectionsProgress[sectionProgressIndex].progress = progress;
              } else {
                this.sectionsProgress.push({
                  sectionId: section.sectionId,
                  progress,
                  progressId: 0,
                  employeeId: 0,
                });
              }
              if (type === 'complete') {
                if (this.sectionIndex() < this.training.sections.length - 1) {
                  this.sectionIndex.update((prev) => prev + 1);
                } else {
                  this.sectionIndex.update(() => -1);
                  this.checkAllSectionsComplete();
                }
              }
            },
            error: (error) => {
              this.openSnackBar('Error updating progress', 'Close');
            },
          });
        this.subscriptions.push(this.updateProgressSubscription);
      } else if (this.sectionIndex() < this.training.sections.length - 1) {
        this.sectionIndex.update((prev) => prev + 1);
      } else if (this.sectionIndex() === this.training.sections.length - 1) {
        this.sectionIndex.update(() => -1);
        this.checkAllSectionsComplete();
      }
    }
  }

  onCompleteNext(section: Sections) {
    this.updateSectionProgress(section, 1, 'complete');
  }

  getProgressBySectionId(sectionId: number): number {
    const sectionProgress = this.sectionsProgress.find(
      (sp) => sp.sectionId === sectionId
    );
    if (sectionProgress) {
      return sectionProgress.progress;
    }
    return -1;
  }

  checkAllSectionsComplete() {
    if (this.training.sections.length === this.sectionsProgress.length) {
      const allSectionsComplete = this.sectionsProgress.every(
        (sp) => sp.progress === 1
      );
      if (allSectionsComplete) {
        this.openSnackBar('All sections completed', 'Close');
      } else {
        this.openSnackBar('Not all sections are completed', 'Close');
      }
    } else {
      this.openSnackBar('Not all sections are completed', 'Close');
    }
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<any> {
    return this._snackBar.open(message, '', {
      duration: 1500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  public openDialogEdit(event: Event, trainingId: number): void {
    event.stopPropagation();
    const getTrainingSubscription = this.trainingService
      .getTrainingById(trainingId)
      .pipe(
        tap((training) => {
          const dialogRef = this.dialog.open(DialogContentExampleDialog, {
            width: '650px',
            height: '600px',
            data: { type: 'edit', trainingId: training.trainingId },
          });
          dialogRef.afterClosed().subscribe((result) => {
            if (result === true) {
              window.location.reload();
            }
          });
        }),
        catchError((error) => {
          console.error('Error fetching training:', error);
          throw error;
        })
      )
      .subscribe();

    this.subscriptions.push(getTrainingSubscription);
  }

  public openDeleteDialog(event: Event, trainingId: number): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { trainingId: trainingId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.trainingService.deleteTraining(trainingId).subscribe({
          next: () => {
            const snackBarRef: MatSnackBarRef<any> = this.openSnackBar(
              'Training deleted successfully',
              'Close'
            );
            this.valuesEmitter.emit(trainingId);
            setTimeout(() => {
              snackBarRef.dismiss();
            }, 1500);
            this.router.navigate(['/dashboard/trainings/calendar']);
          },
          error: (error) => {
            console.error('Error deleting training:', error);
            this.openSnackBar('Error deleting training', 'Close');
          },
        });
      }
    });
  }
}
