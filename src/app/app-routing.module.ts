import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserlistComponent } from './userlist/userlist.component';

const routes: Routes = [
  {
  path:'userList',
  component:UserlistComponent,
  },
  {
    path:'user/:userID',
    component:UserDetailsComponent,
  },
  {path:"**",redirectTo:"/userList"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
