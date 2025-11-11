package org.ms.apigateway.issuetracker.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "issues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String status;   // OPEN, IN_PROGRESS, CLOSED
    private String priority; // LOW, MEDIUM, HIGH

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;   // ✅ refers to your own User entity

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private LocalDate dueDate;

    @Column(length = 512)
    private String tags; // comma-separated

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
