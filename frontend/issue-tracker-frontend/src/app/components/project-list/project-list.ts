import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.scss'],
})
export class ProjectList {
  projects: Project[] = [];
  name = '';
  description = '';
  createdById?: number;

  editId?: number;
  editName = '';
  editDescription = '';
  editCreatedById?: number;

  constructor(private projectService: ProjectService) {
    this.load();
  }

  load() {
    this.projectService.getAllProjects().subscribe(ps => this.projects = ps);
  }

  add() {
    if (!this.name.trim()) return;
    this.projectService.createProject({ name: this.name, description: this.description, createdById: this.createdById })
      .subscribe(() => {
        this.name = '';
        this.description = '';
        this.createdById = undefined;
        this.load();
      });
  }

  remove(id: number) {
    if (confirm('Delete this project?')) {
      this.projectService.deleteProject(id).subscribe(() => this.load());
    }
  }

  startEdit(p: Project) {
    this.editId = p.id;
    this.editName = p.name ?? '';
    this.editDescription = p.description ?? '';
    this.editCreatedById = (p as any).createdById ?? undefined;
  }

  cancelEdit() {
    this.editId = undefined;
    this.editName = '';
    this.editDescription = '';
    this.editCreatedById = undefined;
  }

  saveEdit(id: number) {
    if (!this.editName.trim()) return;
    this.projectService.updateProject(id, {
      name: this.editName,
      description: this.editDescription,
      createdById: this.editCreatedById
    }).subscribe(() => {
      this.cancelEdit();
      this.load();
    });
  }
}
