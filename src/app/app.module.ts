import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { CreateUserComponent } from './features/user/components/create-user/create-user.component';
import { UpdateUserComponent } from './features/user/components/update-user/update-user.component';
import { ListUserComponent } from './features/user/components/list-user/list-user.component';
import { ReadUserComponent } from './features/user/components/read-user/read-user.component';
import { HttpClientModule } from '@angular/common/http';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';





@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CreateUserComponent,
    UpdateUserComponent,
    ListUserComponent,
    ReadUserComponent,
    NotfoundComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
