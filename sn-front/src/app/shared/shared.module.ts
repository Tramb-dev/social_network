import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMenuModule } from "@angular/material/menu";
import { LayoutModule } from "@angular/cdk/layout";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCardModule } from "@angular/material/card";

import { FooterComponent } from "src/app/components/global/footer/footer.component";

const DATE_FORMATS = {
  parse: {
    dateInput: "DD MM YYYY",
  },
  display: {
    dateInput: "DD MMMM YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

export const modules = [
  CommonModule,
  ReactiveFormsModule,
  RouterModule,
  MatFormFieldModule,
  MatIconModule,
  LayoutModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatMenuModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatDialogModule,
  MatCardModule,
];

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, MatMomentDateModule, MatDatepickerModule],
  exports: [FooterComponent, ...modules],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
  ],
})
export class SharedModule {}
