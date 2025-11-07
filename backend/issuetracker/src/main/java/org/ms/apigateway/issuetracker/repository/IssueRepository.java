package org.ms.apigateway.issuetracker.repository;

import org.ms.apigateway.issuetracker.entity.Issue;
import org.ms.apigateway.issuetracker.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByProject(Project project);
}
