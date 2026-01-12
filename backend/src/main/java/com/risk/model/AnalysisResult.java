package com.risk.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "analysis_results")
public class AnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String batchId;

    private LocalDateTime analyzedAt;

    // Low, Medium, High
    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String riskFactors; // Stored as JSON or comma-separated string

    @Column(columnDefinition = "TEXT")
    private String recommendations; // Stored as JSON or comma-separated string

    @PrePersist
    public void prePersist() {
        this.analyzedAt = LocalDateTime.now();
    }
}
