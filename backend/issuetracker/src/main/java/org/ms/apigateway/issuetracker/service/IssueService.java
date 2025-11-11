package org.ms.apigateway.issuetracker.service;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.Issue;
import org.ms.apigateway.issuetracker.entity.Project;
import org.ms.apigateway.issuetracker.entity.User;
import org.ms.apigateway.issuetracker.repository.IssueRepository;
import org.ms.apigateway.issuetracker.repository.ProjectRepository;
import org.ms.apigateway.issuetracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

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
        // New fields
        issue.setTags(dto.tags);
        if (dto.dueDate != null && !dto.dueDate.isBlank()) {
            issue.setDueDate(java.time.LocalDate.parse(dto.dueDate));
        } else {
            issue.setDueDate(null);
        }

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

    public Page<Issue> search(
            String status,
            String priority,
            Long assigneeId,
            Long projectId,
            String fromDate,
            String toDate,
            String tags,
            Pageable pageable
    ) {
        Specification<Issue> spec = Specification.where(null);
        if (status != null && !status.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), status));
        }
        if (priority != null && !priority.isBlank()) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("priority"), priority));
        }
        if (assigneeId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.join("assignedTo").get("id"), assigneeId));
        }
        if (projectId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.join("project").get("id"), projectId));
        }
        if (fromDate != null && !fromDate.isBlank()) {
            java.time.LocalDate from = java.time.LocalDate.parse(fromDate);
            spec = spec.and((root, q, cb) -> cb.greaterThanOrEqualTo(root.get("dueDate"), from));
        }
        if (toDate != null && !toDate.isBlank()) {
            java.time.LocalDate to = java.time.LocalDate.parse(toDate);
            spec = spec.and((root, q, cb) -> cb.lessThanOrEqualTo(root.get("dueDate"), to));
        }
        if (tags != null && !tags.isBlank()) {
            // simple contains match in comma-separated list
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("tags")), "%" + tags.toLowerCase() + "%"));
        }
        return issueRepository.findAll(spec, pageable);
    }
}
