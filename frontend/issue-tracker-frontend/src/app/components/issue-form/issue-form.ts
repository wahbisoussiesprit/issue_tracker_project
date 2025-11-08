import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IssueService } from '../../services/issue';
import { Issue } from '../../models/issue.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { ProjectService } from '../../services/project';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-issue-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './issue-form.html'
})
export class IssueFormComponent implements OnInit {
  issue: Issue = {
    title: '',
    description: '',
    status: 'OPEN',
    priority: 'LOW',
    projectId: 1,
    assignedTo: 1
  };

  projects: Project[] = [];
  users: User[] = [];

  constructor(
    private issueService: IssueService,
    private projectService: ProjectService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(ps => this.projects = ps);
    this.userService.getAllUsers().subscribe(us => this.users = us);
  }

  submit() {
    this.issueService.createIssue(this.issue).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
