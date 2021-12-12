import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MemberGuard } from "src/app/guards/member.guard";
import { MemberComponent } from "./member.component";
import { ProfileComponent } from "./profile/profile.component";
import { WallComponent } from "./wall/wall.component";

const routes: Routes = [
  {
    path: "",
    component: MemberComponent,
    canActivateChild: [MemberGuard],
    children: [
      {
        path: "wall/:wallId",
        component: WallComponent,
      },
      {
        path: "user/:uid",
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
