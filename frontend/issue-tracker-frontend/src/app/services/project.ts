import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../models/project.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiBase}/projects`;

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  createProject(input: { name: string; description: string; createdById?: number }): Observable<Project> {
    const dto = {
      name: input.name,
      description: input.description,
      createdById: input.createdById ?? null
    };
    return this.http.post<Project>(this.apiUrl, dto);
  }

  updateProject(id: number, input: { name: string; description: string; createdById?: number }): Observable<Project> {
    const dto = {
      name: input.name,
      description: input.description,
      createdById: input.createdById ?? null
    };
    return this.http.put<Project>(`${this.apiUrl}/${id}`, dto);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
