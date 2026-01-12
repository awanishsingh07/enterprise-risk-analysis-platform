package com.risk.controller;

import com.risk.model.AnalysisResult;
import com.risk.service.RiskAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend access
@RequiredArgsConstructor
public class RiskController {

    private final RiskAnalysisService riskService;

    @PostMapping("/upload")
    public ResponseEntity<AnalysisResult> uploadData(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        AnalysisResult result = riskService.processAndAnalyze(file);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/analysis")
    public ResponseEntity<List<AnalysisResult>> getHistory() {
        return ResponseEntity.ok(riskService.getAllResults());
    }

    @GetMapping("/batch/{batchId}/records")
    public ResponseEntity<List<com.risk.model.FinancialRecord>> getBatchRecords(
            @PathVariable(value = "batchId") String batchId) {
        return ResponseEntity.ok(riskService.getRecordsByBatch(batchId));
    }
}
