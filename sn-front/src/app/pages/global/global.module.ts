import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";

import { GlobalRoutingModule } from "./global-routing.module";

import { HomeComponent } from "./home/home.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { Error404Component } from "./error404/error404.component";

@NgModule({
  declarations: [
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    Error404Component,
  ],
  imports: [SharedModule, GlobalRoutingModule],
})
export class GlobalModule {}
