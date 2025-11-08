import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list';
import { IssueFormComponent } from './components/issue-form/issue-form';
import { ProjectList } from './components/project-list/project-list';
import { UserList } from './components/user-list/user-list';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  { path: '', component: IssueListComponent, canActivate: [authGuard] },
  { path: 'new', component: IssueFormComponent, canActivate: [authGuard] },
  { path: 'projects', component: ProjectList, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'users', component: UserList, canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
