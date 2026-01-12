import React, { useEffect, useState } from 'react';
import { fetchHistory } from '../services/api';
import { Database, Activity, AlertTriangle, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState({
        totalDatasets: 0,
        totalAnalyses: 0,
        latestRiskLevel: 'N/A',
        avgRiskScore: '0.0'
    });

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const res = await fetchHistory();
            const data = res.data;
            setHistory(data);

            // Calculate stats
            if (data.length > 0) {
                const latest = data[data.length - 1];
                setStats({
                    totalDatasets: data.length, // approximation
                    totalAnalyses: data.length,
                    latestRiskLevel: latest.riskLevel || 'N/A',
                    avgRiskScore: 'N/A' // Need score in backend response to calculate
                });
            }
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        }
    };

    const getRiskColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high': return 'text-red-600';
            case 'medium': return 'text-yellow-600';
            case 'low': return 'text-green-600';
            default: return 'text-slate-400';
        }
    };

    // Dummy data for the Trend Chart to match screenshot until backend supports it
    const trendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Risk Score',
                data: [45, 52, 48, 65, 59, 50],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4
            }
        ]
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <Database className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalDatasets}</p>
                    <p className="text-sm text-slate-500 mt-1">Total Datasets</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <Activity className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.totalAnalyses}</p>
                    <p className="text-sm text-slate-500 mt-1">Total Analyses</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>
                    <p className={`text-xl font-bold ${getRiskColor(stats.latestRiskLevel)}`}>
                        {stats.latestRiskLevel === 'N/A' ? 'No data' : stats.latestRiskLevel}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Latest Risk Level</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{stats.avgRiskScore}</p>
                    <p className="text-sm text-slate-500 mt-1">Avg Risk Score</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Risk Score Trend Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">Risk Score Trend</h3>
                    <div className="h-64">
                        <Line
                            data={trendData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, max: 100 } }
                            }}
                        />
                    </div>
                </div>

                {/* Recent Uploads */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-800 mb-6">Recent Uploads</h3>
                    <div className="space-y-4">
                        {history.length === 0 ? (
                            <p className="text-slate-400 text-sm">No uploads yet</p>
                        ) : (
                            history.slice().reverse().slice(0, 5).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">Batch #{item.id}</p>
                                        <p className="text-xs text-slate-500">{new Date(item.analyzedAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-xs font-medium text-primary-600">Completed</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
