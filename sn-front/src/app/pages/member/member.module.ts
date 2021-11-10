import { NgModule } from "@angular/core";

import { SharedModule } from "src/app/shared/shared.module";
import { MemberRoutingModule } from "./member-routing.module";
import { HeaderModule } from "src/app/components/global/header/header.module";

import { ProfileComponent } from "./profile/profile.component";
import { CircleComponent } from "../../components/member/circle/circle.component";
import { PostComponent } from "../../components/member/post/post.component";
import { CommentComponent } from "../../components/member/comment/comment.component";
import { ReplyComponent } from "src/app/components/member/reply/reply.component";
import { MemberComponent } from "./member.component";

@NgModule({
  declarations: [
    ProfileComponent,
    CircleComponent,
    PostComponent,
    CommentComponent,
    ReplyComponent,
    MemberComponent,
  ],
  imports: [MemberRoutingModule, SharedModule, HeaderModule],
})
export class MemberModule {}
