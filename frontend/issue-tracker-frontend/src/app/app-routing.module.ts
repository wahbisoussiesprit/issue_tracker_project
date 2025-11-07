import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueList } from './components/issue-list/issue-list';
import { IssueForm } from './components/issue-form/issue-form';

const routes: Routes = [
  { path: '', redirectTo: '/issues', pathMatch: 'full' },
  { path: 'issues', component: IssueList },
  { path: 'issues/new', component: IssueForm }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
