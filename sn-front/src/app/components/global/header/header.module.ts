import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HeaderComponent } from "./header.component";
import { MenuComponent } from "../menu/menu.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [HeaderComponent, MenuComponent],
  imports: [CommonModule, SharedModule],
  exports: [HeaderComponent, MenuComponent],
})
export class HeaderModule {}
