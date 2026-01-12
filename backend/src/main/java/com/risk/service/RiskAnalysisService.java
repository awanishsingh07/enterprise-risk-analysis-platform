package com.risk.service;

import com.risk.model.AnalysisResult;
import com.risk.model.FinancialRecord;
import com.risk.repository.AnalysisResultRepository;
import com.risk.repository.FinancialRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RiskAnalysisService {

    private final FinancialRecordRepository recordRepository;
    private final AnalysisResultRepository resultRepository;

    public AnalysisResult processAndAnalyze(MultipartFile file) {
        String batchId = UUID.randomUUID().toString();

        // 1. Parse File
        try {
            List<FinancialRecord> records = parseCsv(file, batchId);
            recordRepository.saveAll(records);

            // 2. Perform Analysis
            return performRiskAnalysis(batchId, records);
        } catch (Exception e) {
            throw new RuntimeException("Failed to process file: " + e.getMessage());
        }
    }

    private List<FinancialRecord> parseCsv(MultipartFile file, String batchId) throws Exception {
        List<FinancialRecord> records = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            boolean isHeader = true;
            while ((line = br.readLine()) != null) {
                if (isHeader) {
                    isHeader = false;
                    continue;
                }
                String[] values = line.split(",");
                if (values.length < 4)
                    continue; // Basic validation

                FinancialRecord record = new FinancialRecord();
                record.setPeriod(values[0].trim());
                record.setTotalRevenue(new BigDecimal(values[1].trim()));
                record.setTotalExpenses(new BigDecimal(values[2].trim()));
                record.setTechnologyCosts(new BigDecimal(values[3].trim()));
                record.setBatchId(batchId);

                records.add(record);
            }
        }
        return records;
    }

    private AnalysisResult performRiskAnalysis(String batchId, List<FinancialRecord> records) {
        if (records.isEmpty())
            return null;

        AnalysisResult result = new AnalysisResult();
        result.setBatchId(batchId);

        List<String> riskFactors = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        // --- 1. Rule-Based Logic ---

        // A. Profit Margin Check
        long lowMarginCount = records.stream()
                .filter(r -> r.getProfitMargin().compareTo(new BigDecimal("0.10")) < 0)
                .count();
        if (lowMarginCount > 0) {
            riskFactors.add("Profit margin is below 10% for " + lowMarginCount + " periods.");
            recommendations.add("Review operational costs to improve margins.");
        }

        // B. Expense Growth vs Revenue Growth
        BigDecimal startRevenue = records.get(0).getTotalRevenue();
        BigDecimal endRevenue = records.get(records.size() - 1).getTotalRevenue();
        BigDecimal startExpenses = records.get(0).getTotalExpenses();
        BigDecimal endExpenses = records.get(records.size() - 1).getTotalExpenses();

        // Calculate simple growth rate if possible
        if (startRevenue.compareTo(BigDecimal.ZERO) > 0 && startExpenses.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal revGrowth = endRevenue.subtract(startRevenue).divide(startRevenue, 4,
                    java.math.RoundingMode.HALF_UP);
            BigDecimal expGrowth = endExpenses.subtract(startExpenses).divide(startExpenses, 4,
                    java.math.RoundingMode.HALF_UP);

            if (expGrowth.compareTo(revGrowth) > 0) {
                riskFactors.add("Expense growth (" + expGrowth + ") is outpacing revenue growth (" + revGrowth + ").");
                recommendations.add("Implement cost-cutting measures immediately.");
            }
        }

        // C. Tech Cost Ratio
        long highTechCostCount = records.stream()
                .filter(r -> {
                    if (r.getTotalRevenue().compareTo(BigDecimal.ZERO) == 0)
                        return false;
                    BigDecimal ratio = r.getTechnologyCosts().divide(r.getTotalRevenue(), 4,
                            java.math.RoundingMode.HALF_UP);
                    return ratio.compareTo(new BigDecimal("0.20")) > 0;
                })
                .count();

        if (highTechCostCount > 0) {
            riskFactors.add("Technology costs exceed 20% of revenue in " + highTechCostCount + " periods.");
            recommendations.add("Audit IT spending and assess ROI on technology investments.");
        }

        // --- 2. Determine Overall Risk Level ---
        int riskScore = 0;
        if (!riskFactors.isEmpty())
            riskScore += riskFactors.size();
        if (lowMarginCount > records.size() / 2)
            riskScore += 2;

        if (riskScore == 0)
            result.setRiskLevel("Low");
        else if (riskScore <= 2)
            result.setRiskLevel("Medium");
        else
            result.setRiskLevel("High");

        result.setRiskFactors(String.join(" | ", riskFactors));
        result.setRecommendations(String.join(" | ", recommendations));

        return resultRepository.save(result);
    }

    public List<AnalysisResult> getAllResults() {
        return resultRepository.findAll();
    }

    public List<FinancialRecord> getRecordsByBatch(String batchId) {
        return recordRepository.findByBatchId(batchId);
    }
}
