package org.ms.apigateway.issuetracker.controller;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.Project;
import org.ms.apigateway.issuetracker.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.ms.apigateway.issuetracker.dto.ProjectDto;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Optional<Project> getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PostMapping
    public Project createProject(@RequestBody ProjectDto dto) {
        return projectService.createFromDto(dto);
    }

    @PutMapping("/{id}")
    public Optional<Project> updateProject(@PathVariable Long id, @RequestBody ProjectDto dto) {
        return projectService.updateFromDto(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
