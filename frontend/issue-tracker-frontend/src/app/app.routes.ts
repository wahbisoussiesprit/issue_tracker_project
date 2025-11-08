import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list';
import { IssueFormComponent } from './components/issue-form/issue-form';
import { ProjectList } from './components/project-list/project-list';
import { UserList } from './components/user-list/user-list';

export const routes: Routes = [
  { path: '', component: IssueListComponent },
  { path: 'new', component: IssueFormComponent },
  { path: 'projects', component: ProjectList },
  { path: 'users', component: UserList }
];
