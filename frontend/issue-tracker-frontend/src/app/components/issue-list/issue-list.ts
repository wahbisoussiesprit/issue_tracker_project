import { Component, OnInit } from '@angular/core';
import { Issue } from '../../models/issue.model';
import { IssueService } from '../../services/issue';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './issue-list.html'
})
export class IssueListComponent implements OnInit {
  issues: Issue[] = [];

  editId?: number;
  editTitle = '';
  editStatus = '';
  editPriority = '';

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

  startEdit(issue: Issue) {
    this.editId = issue.id;
    this.editTitle = issue.title ?? '';
    this.editStatus = issue.status ?? '';
    this.editPriority = issue.priority ?? '';
  }

  cancelEdit() {
    this.editId = undefined;
    this.editTitle = '';
    this.editStatus = '';
    this.editPriority = '';
  }

  saveEdit(id: number) {
    const payload: Issue = {
      title: this.editTitle,
      description: undefined as any,
      status: this.editStatus,
      priority: this.editPriority,
      projectId: undefined as any,
      assignedTo: undefined as any,
    };
    this.issueService.updateIssue(id, payload).subscribe(() => {
      this.cancelEdit();
      this.loadIssues();
    });
  }
}
