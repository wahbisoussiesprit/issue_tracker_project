import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue';
import { Issue } from '../../models/issue.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './issue-form.html'
})
export class IssueFormComponent {
  issue: Issue = {
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'LOW',
    projectId: 1,
    assignedTo: 1
  };

  constructor(private issueService: IssueService, private router: Router) {}

  submit() {
    this.issueService.createIssue(this.issue).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
