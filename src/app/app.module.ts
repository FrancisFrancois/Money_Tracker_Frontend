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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateCategoryComponent } from './features/category/components/create-category/create-category.component';
import { UpdateCategoryComponent } from './features/category/components/update-category/update-category.component';
import { ListCategoryComponent } from './features/category/components/list-category/list-category.component';
import { ReadCategoryComponent } from './features/category/components/read-category/read-category.component';
import { CreateHomeComponent } from './features/home/components/create-home/create-home.component';
import { ReadHomeComponent } from './features/home/components/read-home/read-home.component';
import { UpdateHomeComponent } from './features/home/components/update-home/update-home.component';
import { ListHomeComponent } from './features/home/components/list-home/list-home.component';





@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    CreateUserComponent,
    UpdateUserComponent,
    ListUserComponent,
    ReadUserComponent,
    NotfoundComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent,
    ListCategoryComponent,
    ReadCategoryComponent,
    CreateHomeComponent,
    ReadHomeComponent,
    UpdateHomeComponent,
    ListHomeComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
