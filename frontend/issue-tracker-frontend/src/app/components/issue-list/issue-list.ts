import { Component, OnInit, OnDestroy } from '@angular/core';
import { Issue } from '../../models/issue.model';
import { IssueService } from '../../services/issue';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { ProjectService } from '../../services/project';
import { UserService } from '../../services/user';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issue-list.html'
})
export class IssueListComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];

  editId?: number;
  editTitle = '';
  editStatus = '';
  editPriority = '';

  // UI: search and filters (client-side for now)
  search = '';
  statusFilter = '';
  priorityFilter = '';
  readonly statuses = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
  readonly priorities = ['LOW', 'MEDIUM', 'HIGH'];

  // Drawer/modal state and draft
  showDrawer = false;
  toast: string | null = null;
  draft: Issue | null = null;

  projects: Project[] = [];
  users: User[] = [];

  constructor(private issueService: IssueService,
              private projectService: ProjectService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              public auth: AuthService) {}

  ngOnInit(): void {
    // Load static lists
    this.projectService.getAllProjects().subscribe(ps => this.projects = ps);
    this.userService.getAllUsers().subscribe(us => this.users = us);
    // Initialize from URL
    this.route.queryParams.subscribe(q => {
      this.search = q['q'] ?? '';
      this.statusFilter = q['status'] ?? '';
      this.priorityFilter = q['priority'] ?? '';
      this.assigneeId = q['assigneeId'] ? Number(q['assigneeId']) : undefined;
      this.projectId = q['projectId'] ? Number(q['projectId']) : undefined;
      this.fromDate = q['fromDate'] ?? '';
      this.toDate = q['toDate'] ?? '';
      this.tagsFilter = q['tags'] ?? '';
      this.page = q['page'] ? Number(q['page']) : 0;
      this.size = q['size'] ? Number(q['size']) : 9;
      this.sort = q['sort'] ?? 'id,desc';
      this.loadPage();
    });
    // Periodic auto-refresh to reflect changes made by other users/admins
    this.refreshTimer = setInterval(() => this.loadPage(), 10000);
  }

  ngOnDestroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined as any;
    }
  }

  // Server pagination
  totalPages = 0;
  totalElements = 0;
  page = 0;
  size = 9;
  sort = 'id,desc';

  // Advanced filters
  assigneeId?: number;
  projectId?: number;
  fromDate = '';
  toDate = '';
  tagsFilter = '';
  showFilters = false;
  private refreshTimer: any;

  loadPage() {
    this.issueService.searchIssues({
      page: this.page,
      size: this.size,
      sort: this.sort,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      assigneeId: this.assigneeId,
      projectId: this.projectId,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      tags: this.tagsFilter || undefined,
      q: this.search || undefined
    }).subscribe(res => {
      this.issues = res.content;
      this.totalPages = res.totalPages;
      this.totalElements = res.totalElements;
    });
  }

  applyFilters() {
    const q: any = {
      q: this.search || undefined,
      status: this.statusFilter || undefined,
      priority: this.priorityFilter || undefined,
      assigneeId: this.assigneeId || undefined,
      projectId: this.projectId || undefined,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
      tags: this.tagsFilter || undefined,
      page: 0,
      size: this.size,
      sort: this.sort
    };
    this.router.navigate([], { relativeTo: this.route, queryParams: q, queryParamsHandling: 'merge' });
    this.showFilters = false;
  }

  nextPage() { if (this.page + 1 < this.totalPages) { this.page++; this.updatePageQuery(); } }
  prevPage() { if (this.page > 0) { this.page--; this.updatePageQuery(); } }
  updatePageQuery() {
    this.router.navigate([], { relativeTo: this.route, queryParams: { page: this.page, size: this.size, sort: this.sort }, queryParamsHandling: 'merge' });
  }

  deleteIssue(id: number) {
    if (confirm('Are you sure you want to delete this issue?')) {
      this.issueService.deleteIssue(id).subscribe(() => this.loadPage());
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
    const curr = this.issues.find(x => x.id === id);
    if (!curr) return;
    const payload: Issue = {
      title: curr.title,
      description: (curr as any).description,
      status: curr.status,
      priority: curr.priority,
      projectId: (curr as any).projectId,
      assignedTo: (curr as any).assignedTo,
      dueDate: (curr as any).dueDate,
      tags: (curr as any).tags
    };
    this.issueService.updateIssue(id, payload).subscribe(() => {
      this.showToast('Issue updated');
      this.loadPage();
    });
  }

  openCreate() {
    this.draft = {
      title: '',
      description: '',
      status: 'OPEN',
      priority: 'LOW',
      projectId: this.projects[0]?.id ?? undefined as any,
      assignedTo: undefined as any,
      dueDate: '',
      tags: ''
    };
    this.showDrawer = true;
  }

  openEdit(issue: Issue) {
    this.draft = { ...issue } as any;
    this.showDrawer = true;
  }

  closeDrawer() {
    this.showDrawer = false;
    this.draft = null;
  }

  saveDraft() {
    if (!this.draft) return;
    const op = this.draft.id
      ? this.issueService.updateIssue(this.draft.id, this.draft)
      : this.issueService.createIssue(this.draft);
    op.subscribe(() => {
      this.closeDrawer();
      this.showToast(this.draft?.id ? 'Issue saved' : 'Issue created');
      this.loadPage();
    });
  }

  private showToast(msg: string) {
    this.toast = msg;
    setTimeout(() => this.toast = null, 2000);
  }

  get filteredIssues(): Issue[] {
    // With server-side filtering, just return current payload
    return this.issues;
  }

  // Helpers for display-only fields possibly absent from Issue model
  assigneeInitials(issue: Issue): string {
    const name = (issue as any).assigneeUsername as string | undefined;
    return (name?.slice(0, 2) || 'NA').toUpperCase();
  }

  assigneeName(issue: Issue): string {
    return ((issue as any).assigneeUsername as string | undefined) || 'Unassigned';
  }

  dueDateText(issue: Issue): string {
    return ((issue as any).dueDate as string | undefined) || '';
  }

  tagList(issue: Issue): string[] {
    const raw = ((issue as any).tags as string | undefined) || '';
    return raw.split(',').map(t => t.trim()).filter(Boolean);
  }

  isOverdue(issue: Issue): boolean {
    const d = (issue as any).dueDate as string | undefined;
    if (!d) return false;
    try {
      const due = new Date(d);
      const today = new Date();
      due.setHours(0,0,0,0); today.setHours(0,0,0,0);
      return due < today && issue.status !== 'CLOSED';
    } catch { return false; }
  }
}
