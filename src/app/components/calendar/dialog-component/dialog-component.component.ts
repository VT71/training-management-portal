import { Component } from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { TrainingFormComponent } from '../../training-form/training-form.component';


@Component({
  selector: 'app-dialog-component',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, TrainingFormComponent],
  templateUrl: './dialog-component.component.html',
  styleUrl: './dialog-component.component.css'
})
export class DialogComponentComponent {
  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-component.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, TrainingFormComponent]
})
export class DialogContentExampleDialog {}