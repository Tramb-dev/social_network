import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Error404Component } from "./error404/error404.component";
import { GlobalComponent } from "./global.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

const routes: Routes = [
  {
    path: "",
    component: GlobalComponent,
    children: [
      {
        path: "sign-in",
        component: SignInComponent,
      },
      {
        path: "sign-up",
        component: SignUpComponent,
      },
      {
        path: "reset-password",
        component: ResetPasswordComponent,
      },
    ],
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
