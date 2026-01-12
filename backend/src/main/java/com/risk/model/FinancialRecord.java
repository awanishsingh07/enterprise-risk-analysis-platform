package com.risk.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "financial_records")
public class FinancialRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // e.g., "Q1-2023", "2023-Jan"
    @Column(nullable = false)
    private String period;

    @Column(nullable = false)
    private BigDecimal totalRevenue;

    @Column(nullable = false)
    private BigDecimal totalExpenses;

    private BigDecimal profitMargin;

    // Specific field for Tech Impact Analysis
    private BigDecimal technologyCosts;

    // Batch ID to group uploads
    private String batchId;

    @PrePersist
    public void calculateMetrics() {
        if (totalRevenue != null && totalRevenue.compareTo(BigDecimal.ZERO) != 0) {
            // Profit Margin = (Revenue - Expenses) / Revenue
            this.profitMargin = totalRevenue.subtract(totalExpenses)
                    .divide(totalRevenue, 4, java.math.RoundingMode.HALF_UP);
        }
    }
}
