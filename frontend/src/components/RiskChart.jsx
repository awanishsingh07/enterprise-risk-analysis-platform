import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchBatchRecords } from '../services/api';

const RiskChart = ({ batchId }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!batchId) return;

        const loadData = async () => {
            try {
                const res = await fetchBatchRecords(batchId);
                const records = res.data;

                // Sort by Period if possible. Assuming Period is "Q1 2023" etc, we might rely on input order or explicit sort logic.
                // For MVP, we use input order or simple alpha sort if needed.
                // records.sort((a, b) => a.period.localeCompare(b.period));

                const labels = records.map(r => r.period);
                const revenue = records.map(r => r.totalRevenue);
                const expenses = records.map(r => r.totalExpenses);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Total Revenue',
                            data: revenue,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            tension: 0.2
                        },
                        {
                            label: 'Total Expenses',
                            data: expenses,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            tension: 0.2
                        }
                    ]
                });
            } catch (err) {
                console.error("Failed to load chart data", err);
            }
        };

        loadData();
    }, [batchId]);

    if (!chartData) return <div className="h-64 bg-slate-50 rounded-lg animate-pulse"></div>;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Revenue vs Expenses Trend',
            },
        },
    };

    return <Line options={options} data={chartData} />;
};

export default RiskChart;
