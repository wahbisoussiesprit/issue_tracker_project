package org.ms.apigateway.issuetracker.service;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.Issue;
import org.ms.apigateway.issuetracker.entity.Project;
import org.ms.apigateway.issuetracker.repository.IssueRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;

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
}
