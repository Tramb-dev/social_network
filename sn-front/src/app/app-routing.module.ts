import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "./guards/admin.guard";
import { MemberGuard } from "./guards/member.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/sign-up",
  },
  {
    path: "",
    loadChildren: () =>
      import("./pages/global/global.module").then((m) => m.GlobalModule),
  },
  {
    path: "member",
    canActivateChild: [MemberGuard],
    canLoad: [MemberGuard],
    loadChildren: () =>
      import("./pages/member/member.module").then((m) => m.MemberModule),
  },
  {
    path: "admin",
    canLoad: [AdminGuard],
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
