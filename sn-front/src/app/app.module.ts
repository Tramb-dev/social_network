import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { environment } from "src/environments/environment";

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";
import { MemberModule } from "./pages/member/member.module";
import { GlobalModule } from "./pages/global/global.module";
import { AdminModule } from "./pages/admin/admin.module";

import { AuthInterceptor } from "./_helpers/auth.interceptor";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ["websocket"],
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    BrowserAnimationsModule,
    GlobalModule,
    MemberModule,
    AdminModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
