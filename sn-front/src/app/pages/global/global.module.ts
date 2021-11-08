import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GlobalRoutingModule } from "./global-routing.module";

import { HomeComponent } from "./home/home.component";

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, GlobalRoutingModule],
})
export class GlobalModule {}
