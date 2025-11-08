import { Component, OnInit } from '@angular/core';
import { Issue } from '../../models/issue.model';
import { IssueService } from '../../services/issue';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './issue-list.html'
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];

  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues() {
    this.issueService.getAllIssues().subscribe(data => {
      this.issues = data;
    });
  }

  deleteIssue(id: number) {
    if (confirm('Are you sure you want to delete this issue?')) {
      this.issueService.deleteIssue(id).subscribe(() => this.loadIssues());
    }
  }
}
