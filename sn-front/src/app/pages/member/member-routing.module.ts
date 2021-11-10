import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MemberComponent } from "./member.component";
import { ProfileComponent } from "./profile/profile.component";

const routes: Routes = [
  {
    path: "",
    component: MemberComponent,
    children: [
      {
        path: ":id",
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
