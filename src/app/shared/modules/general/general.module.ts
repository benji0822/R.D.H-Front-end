import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import { MatChipsModule } from '@angular/material/chips';
import {MatRadioModule} from '@angular/material/radio'
import {MatListModule} from '@angular/material/list'
import { MatSelectModule } from '@angular/material/select';
import {MatSnackBar} from '@angular/material/snack-bar'
import {MatProgressBarModule} from '@angular/material/progress-bar'




@NgModule({
  declarations: [],
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatRadioModule,
    MatListModule,
    MatSelectModule,
    MatProgressBarModule
    
  ],
  providers: [],
  exports: [CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatRadioModule,
    MatListModule,
    MatSelectModule,
    MatProgressBarModule
  ],
})
export class GeneralModule { }
