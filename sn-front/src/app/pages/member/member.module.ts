import { NgModule } from "@angular/core";

import { SharedModule } from "src/app/shared/shared.module";
import { MemberRoutingModule } from "./member-routing.module";
import { HeaderModule } from "src/app/components/global/header/header.module";

import { ProfileComponent } from "./profile/profile.component";
import { CircleComponent } from "../../components/member/circle/circle.component";
import { PostComponent } from "../../components/member/post/post.component";
import { ReplyComponent } from "src/app/components/member/reply/reply.component";
import { MemberComponent } from "./member.component";
import { WallComponent } from "./wall/wall.component";
import { FindUserComponent } from "./find-user/find-user.component";
import { FriendsListComponent } from "./friends-list/friends-list.component";
import { WallMenuComponent } from "src/app/components/member/wall-menu/wall-menu.component";
import { UserFinderComponent } from "../../components/global/user-finder/user-finder.component";
import { DiscussionsListComponent } from "./discussions-list/discussions-list.component";
import { DiscussionComponent } from "./discussion/discussion.component";

@NgModule({
  declarations: [
    ProfileComponent,
    CircleComponent,
    PostComponent,
    ReplyComponent,
    MemberComponent,
    WallComponent,
    FindUserComponent,
    FriendsListComponent,
    WallMenuComponent,
    UserFinderComponent,
    DiscussionsListComponent,
    DiscussionComponent,
  ],
  imports: [MemberRoutingModule, SharedModule, HeaderModule],
})
export class MemberModule {}
