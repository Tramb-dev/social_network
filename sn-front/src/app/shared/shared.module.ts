import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";

export const modules = [
  CommonModule,
  BrowserModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [...modules],
})
export class SharedModule {}
