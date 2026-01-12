package com.risk.repository;

import com.risk.model.AnalysisResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, Long> {
    Optional<AnalysisResult> findTopByOrderByAnalyzedAtDesc();

    List<AnalysisResult> findByBatchId(String batchId);
}
