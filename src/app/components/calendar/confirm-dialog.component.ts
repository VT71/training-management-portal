import { Component } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatButtonModule, MatButton],
  standalone: true,
  template: `
   <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content container>
      <p>Are you sure you want to delete this training?</p>
    </div>
    <div class="mat-dialog-actions">
      <button mat-flat-button class="main" (click)="onCancel()">Cancel</button>
      <button mat-flat-button class="main" (click)="onConfirm()" cdkFocusInitial>Confirm</button>
    </div>
   

    <style>

      p, h1 {
        text-align: center;
        padding: 20px;
      }
      
      .mat-dialog-actions{
        display: flex;
        justify-content: space-evenly;
        padding: 10px;
      } 

      .mat-button {
        background-color: var(--main);
        color: white;
        border-radius: 5px;
        font-size: medium;
        border: none;
        width: 100px;
        height: 20px;
      }
      
    </style>
  `,
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
