package org.ms.apigateway.issuetracker.service;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.Issue;
import org.ms.apigateway.issuetracker.entity.Project;
import org.ms.apigateway.issuetracker.entity.User;
import org.ms.apigateway.issuetracker.repository.IssueRepository;
import org.ms.apigateway.issuetracker.repository.ProjectRepository;
import org.ms.apigateway.issuetracker.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.ms.apigateway.issuetracker.dto.IssueDto;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public List<Issue> getIssuesByProject(Project project) {
        return issueRepository.findByProject(project);
    }

    public Issue createIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    public Issue createIssueFromDto(IssueDto dto) {
        Issue issue = new Issue();
        applyDto(issue, dto);
        return issueRepository.save(issue);
    }

    public Optional<Issue> updateIssue(Long id, IssueDto dto) {
        return issueRepository.findById(id).map(existing -> {
            applyDto(existing, dto);
            return issueRepository.save(existing);
        });
    }

    private void applyDto(Issue issue, IssueDto dto) {
        issue.setTitle(dto.title);
        issue.setDescription(dto.description);
        issue.setStatus(dto.status);
        issue.setPriority(dto.priority);

        if (dto.projectId != null) {
            Project project = projectRepository.findById(dto.projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + dto.projectId));
            issue.setProject(project);
        } else {
            issue.setProject(null);
        }

        if (dto.assignedTo != null) {
            User user = userRepository.findById(dto.assignedTo)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.assignedTo));
            issue.setAssignedTo(user);
        } else {
            issue.setAssignedTo(null);
        }
    }
}
