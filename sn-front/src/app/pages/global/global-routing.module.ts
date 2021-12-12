import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResetPasswordGuard } from "src/app/guards/reset-password.guard";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
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
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
      {
        path: "reset-password/:rid",
        canActivate: [ResetPasswordGuard],
        component: ResetPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GlobalRoutingModule {}
