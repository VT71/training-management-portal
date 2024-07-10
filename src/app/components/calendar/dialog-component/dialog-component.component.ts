import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { TrainingFormComponent } from '../../training-form/training-form.component';
import { DialogData } from './dialog.interface';
import { FormControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-component.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TrainingFormComponent, MatInput, MatIcon, MatIconButton, MatIconModule],
})
export class DialogContentExampleDialog {
  public deadline = '';

  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (this.data.selectedDate) {
      this.deadline = this.data.selectedDate;
    }
  }

  public closeFromTable(): void {
    this.dialogRef.close();
  }
}
