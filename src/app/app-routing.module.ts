import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './features/user/components/create-user/create-user.component';
import { UpdateUserComponent } from './features/user/components/update-user/update-user.component';
import { ListUserComponent } from './features/user/components/list-user/list-user.component';
import { ReadUserComponent } from './features/user/components/read-user/read-user.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { CreateCategoryComponent } from './features/category/components/create-category/create-category.component';
import { UpdateCategoryComponent } from './features/category/components/update-category/update-category.component';
import { ListCategoryComponent } from './features/category/components/list-category/list-category.component';
import { ReadCategoryComponent } from './features/category/components/read-category/read-category.component';
import { CreateHomeComponent } from './features/home/components/create-home/create-home.component';
import { UpdateHomeComponent } from './features/home/components/update-home/update-home.component';
import { ListHomeComponent } from './features/home/components/list-home/list-home.component';
import { ReadHomeComponent } from './features/home/components/read-home/read-home.component';
import { CreateExpenseComponent } from './features/expense/components/create-expense/create-expense.component';
import { UpdateExpenseComponent } from './features/expense/components/update-expense/update-expense.component';
import { ListExpenseComponent } from './features/expense/components/list-expense/list-expense.component';
import { ReadExpenseComponent } from './features/expense/components/read-expense/read-expense.component';


const routes: Routes = [
  { path : "create-user", component: CreateUserComponent },
  { path : "update-user/:id", component: UpdateUserComponent },
  { path : "list-user", component: ListUserComponent },
  { path : "read-user/:id", component: ReadUserComponent },
  { path : "create-category", component: CreateCategoryComponent },
  { path : "update-category/:id", component: UpdateCategoryComponent },
  { path : "list-category", component: ListCategoryComponent },
  { path : "read-category/:id", component: ReadCategoryComponent },
  { path : "create-home", component: CreateHomeComponent },
  { path : "update-home/:id", component: UpdateHomeComponent },
  { path : "list-home", component: ListHomeComponent },
  { path : "read-home/:id", component: ReadHomeComponent},
  { path : "create-expense", component: CreateExpenseComponent },
  { path : "update-expense/:id", component: UpdateExpenseComponent },
  { path : "list-expense", component: ListExpenseComponent },
  { path : "read-expense/:id", component: ReadExpenseComponent}, 
  { path : "not-found", component: NotfoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
