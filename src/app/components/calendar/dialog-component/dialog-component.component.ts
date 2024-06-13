import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { TrainingFormComponent } from '../../training-form/training-form.component';
import { DialogData } from './dialog.interface';


@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-component.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, TrainingFormComponent]
})

export class DialogContentExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}