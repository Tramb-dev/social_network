import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { LayoutModule } from "@angular/cdk/layout";
import { FooterComponent } from "src/app/components/global/footer/footer.component";

export const modules = [
  CommonModule,
  ReactiveFormsModule,
  HttpClientModule,
  RouterModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  LayoutModule,
  MatFormFieldModule,
  MatInputModule,
];

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule],
  exports: [FooterComponent, ...modules],
})
export class SharedModule {}
