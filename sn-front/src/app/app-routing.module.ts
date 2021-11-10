import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Error404Component } from "./pages/global/error404/error404.component";
import { SignInComponent } from "./pages/global/sign-in/sign-in.component";
import { SignUpComponent } from "./pages/global/sign-up/sign-up.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/sign-in",
  },
  {
    path: "",
    loadChildren: () =>
      import("./pages/global/global.module").then((m) => m.GlobalModule),
  },
  {
    path: "member",
    loadChildren: () =>
      import("./pages/member/member.module").then((m) => m.MemberModule),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./pages/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "**",
    redirectTo: "not-found",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
