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
}
