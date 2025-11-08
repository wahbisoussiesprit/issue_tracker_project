import { Routes } from '@angular/router';
import { IssueListComponent } from './components/issue-list/issue-list';
import { IssueFormComponent } from './components/issue-form/issue-form';

export const routes: Routes = [
  { path: '', component: IssueListComponent },
  { path: 'new', component: IssueFormComponent }
];
