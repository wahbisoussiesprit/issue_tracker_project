package org.ms.apigateway.issuetracker.dto;

public class IssueDto {
    public Long id;
    public String title;
    public String description;
    public String status;
    public String priority;
    public Long projectId;
    public Long assignedTo; // user id
    public String dueDate; // ISO date (yyyy-MM-dd)
    public String tags;    // comma-separated tags
}
