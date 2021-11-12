import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

import { GlobalRoutingModule } from "./global-routing.module";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { HomeComponent } from "./home/home.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { Error404Component } from "./error404/error404.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { GlobalComponent } from "./global.component";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

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

@NgModule({
  declarations: [
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    Error404Component,
    ResetPasswordComponent,
    GlobalComponent,
  ],
  imports: [
    SharedModule,
    MatMomentDateModule,
    GlobalRoutingModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "fr-FR" },
  ],
})
export class GlobalModule {}
