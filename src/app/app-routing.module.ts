import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './features/user/components/create-user/create-user.component';
import { UpdateUserComponent } from './features/user/components/update-user/update-user.component';
import { ListUserComponent } from './features/user/components/list-user/list-user.component';
import { ReadUserComponent } from './features/user/components/read-user/read-user.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';


const routes: Routes = [
  { path : "create-user", component: CreateUserComponent },
  { path : "update-user/:id", component: UpdateUserComponent },
  { path : "list-user", component: ListUserComponent },
  { path : "read-user/:id", component: ReadUserComponent },
  { path : "not-found", component: NotfoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
