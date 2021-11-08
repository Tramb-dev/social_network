import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { environment } from "src/environments/environment";

import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";

import { AppRoutingModule } from "./app-routing.module";
import { SharedModule } from "./shared/shared.module";
import { AppComponent } from "./app.component";
import { MemberModule } from "./pages/member/member.module";
import { GlobalModule } from "./pages/global/global.module";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { LayoutModule } from "@angular/cdk/layout";

import { HeaderComponent } from "./components/global/header/header.component";
import { FooterComponent } from "./components/global/footer/footer.component";
import { MenuComponent } from "./components/global/menu/menu.component";

const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    transports: ["websocket"],
  },
};

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, MenuComponent],
  imports: [
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    LayoutModule,
    GlobalModule,
    MemberModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
