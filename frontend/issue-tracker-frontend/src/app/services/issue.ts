import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private apiUrl = 'http://localhost:8080/api/issues';

  constructor(private http: HttpClient) {}

  getAllIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.apiUrl);
  }

  searchIssues(params: {
    page?: number;
    size?: number;
    sort?: string;
    status?: string;
    priority?: string;
    assigneeId?: number;
    projectId?: number;
    fromDate?: string;
    toDate?: string;
    tags?: string;
    q?: string;
  }): Observable<{ content: Issue[]; totalPages: number; totalElements: number; number: number; size: number; }> {
    const query = new URLSearchParams();
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.size !== undefined) query.set('size', String(params.size));
    if (params.sort) query.set('sort', params.sort);
    if (params.status) query.set('status', params.status);
    if (params.priority) query.set('priority', params.priority);
    if (params.assigneeId !== undefined) query.set('assigneeId', String(params.assigneeId));
    if (params.projectId !== undefined) query.set('projectId', String(params.projectId));
    if (params.fromDate) query.set('fromDate', params.fromDate);
    if (params.toDate) query.set('toDate', params.toDate);
    if (params.tags) query.set('tags', params.tags);
    // optional: full-text q can be mapped later server-side
    return this.http.get<{ content: Issue[]; totalPages: number; totalElements: number; number: number; size: number; }>(
      `${this.apiUrl}/search?${query.toString()}`
    );
  }

  getIssueById(id: number): Observable<Issue> {
    return this.http.get<Issue>(`${this.apiUrl}/${id}`);
  }

  createIssue(issue: Issue): Observable<Issue> {
    return this.http.post<Issue>(this.apiUrl, issue);
  }

  updateIssue(id: number, issue: Issue): Observable<Issue> {
    return this.http.put<Issue>(`${this.apiUrl}/${id}`, issue);
  }

  deleteIssue(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
