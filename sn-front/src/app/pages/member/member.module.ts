import { NgModule } from "@angular/core";

import { SharedModule } from "src/app/shared/shared.module";
import { MemberRoutingModule } from "./member-routing.module";
import { MatFormFieldModule } from "@angular/material/form-field";

import { ProfileComponent } from "./profile/profile.component";
import { CircleComponent } from "../../components/member/circle/circle.component";
import { PostComponent } from "../../components/member/post/post.component";
import { CommentComponent } from "../../components/member/comment/comment.component";
import { ReplyComponent } from "src/app/components/member/reply/reply.component";

@NgModule({
  declarations: [
    ProfileComponent,
    CircleComponent,
    PostComponent,
    CommentComponent,
    ReplyComponent,
  ],
  imports: [MemberRoutingModule, SharedModule, MatFormFieldModule],
})
export class MemberModule {}
