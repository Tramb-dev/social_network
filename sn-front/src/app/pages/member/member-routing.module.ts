import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MemberGuard } from "src/app/guards/member.guard";
import { FindUserComponent } from "./find-user/find-user.component";
import { FriendsListComponent } from "./friends-list/friends-list.component";
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
        path: "my-profile",
        component: ProfileComponent,
      },
      {
        path: "find-user",
        component: FindUserComponent,
      },
      {
        path: "friends",
        component: FriendsListComponent,
      },
      {
        path: "feed",
        component: WallComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
