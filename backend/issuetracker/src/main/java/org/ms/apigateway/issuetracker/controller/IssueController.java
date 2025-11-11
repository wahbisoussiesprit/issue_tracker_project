package org.ms.apigateway.issuetracker.controller;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.Issue;
import org.ms.apigateway.issuetracker.service.IssueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.ms.apigateway.issuetracker.dto.IssueDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IssueController {
    private final IssueService issueService;

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    @GetMapping("/{id}")
    public Optional<Issue> getIssue(@PathVariable Long id) {
        return issueService.getIssueById(id);
    }

    @PostMapping
    public Issue createIssue(@RequestBody IssueDto dto) {
        return issueService.createIssueFromDto(dto);
    }

    @PutMapping("/{id}")
    public Optional<Issue> updateIssue(@PathVariable Long id, @RequestBody IssueDto dto) {
        return issueService.updateIssue(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
    }

    @GetMapping("/search")
    public Page<Issue> searchIssues(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String tags,
            Pageable pageable
    ) {
        return issueService.search(status, priority, assigneeId, projectId, fromDate, toDate, tags, pageable);
    }
}
