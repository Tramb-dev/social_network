import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Error404Component } from "./error404/error404.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

const routes: Routes = [
  /* {
    path: "",
    pathMatch: "full",
    redirectTo: "sign-in",
  }, */
  {
    path: "sign-in",
    component: SignInComponent,
  },
  {
    path: "sign-up",
    component: SignUpComponent,
  },
  {
    path: "not-found",
    component: Error404Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalRoutingModule {}
