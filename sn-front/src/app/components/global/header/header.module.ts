import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "./header.component";
import { MenuComponent } from "../menu/menu.component";
import { SharedModule } from "src/app/shared/shared.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [HeaderComponent, MenuComponent],
  imports: [CommonModule, SharedModule, MatToolbarModule, MatMenuModule],
  exports: [HeaderComponent, MenuComponent],
})
export class HeaderModule {}
