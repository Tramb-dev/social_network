import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  {
    path: "member",
    component: ProfileComponent,
    children: [
      {
        path: ":id",
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
