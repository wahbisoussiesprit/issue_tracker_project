package org.ms.apigateway.issuetracker.service;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.Project;
import org.ms.apigateway.issuetracker.entity.User;
import org.ms.apigateway.issuetracker.repository.ProjectRepository;
import org.ms.apigateway.issuetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.ms.apigateway.issuetracker.dto.ProjectDto;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public Optional<Project> updateProject(Long id, Project updated) {
        return projectRepository.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setDescription(updated.getDescription());
            existing.setCreatedBy(updated.getCreatedBy());
            return projectRepository.save(existing);
        });
    }

    public Project createFromDto(ProjectDto dto) {
        Project p = new Project();
        applyDto(p, dto);
        return projectRepository.save(p);
    }

    public Optional<Project> updateFromDto(Long id, ProjectDto dto) {
        return projectRepository.findById(id).map(existing -> {
            applyDto(existing, dto);
            return projectRepository.save(existing);
        });
    }

    private void applyDto(Project project, ProjectDto dto) {
        project.setName(dto.name);
        project.setDescription(dto.description);
        if (dto.createdById != null) {
            User user = userRepository.findById(dto.createdById)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.createdById));
            project.setCreatedBy(user);
        } else {
            project.setCreatedBy(null);
        }
    }
}
