import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "./guards/admin.guard";
import { GlobalsGuard } from "./guards/globals.guard";
import { MemberGuard } from "./guards/member.guard";
import { Error404Component } from "./pages/global/error404/error404.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "/sign-up",
  },
  {
    path: "",
    canActivate: [GlobalsGuard],
    loadChildren: () =>
      import("./pages/global/global.module").then((m) => m.GlobalModule),
  },
  {
    path: "member",
    canActivate: [MemberGuard],
    canLoad: [MemberGuard],
    loadChildren: () =>
      import("./pages/member/member.module").then((m) => m.MemberModule),
  },
  {
    path: "admin",
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
    loadChildren: () =>
      import("./pages/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "not-found",
    component: Error404Component,
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
