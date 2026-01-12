import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchHistory } from '../services/api';
import RiskChart from '../components/RiskChart';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const RiskAnalysisPage = () => {
    const location = useLocation();
    const [result, setResult] = useState(location.state?.result || null);

    useEffect(() => {
        // If no result passed via navigation, try to fetch specific or latest
        if (!result) {
            loadLatestAnalysis();
        }
    }, [result]);

    const loadLatestAnalysis = async () => {
        try {
            const res = await fetchHistory();
            if (res.data && res.data.length > 0) {
                setResult(res.data[res.data.length - 1]);
            }
        } catch (err) {
            console.error("Failed to load analysis", err);
        }
    };

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8 bg-white rounded-xl border border-slate-200 border-dashed">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-semibold text-slate-700 mb-2">No risk analyses available yet.</h2>
                <p className="text-slate-500">Upload a dataset to generate your first analysis.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Risk Analysis</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Trends Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-800">Financial Trends</h3>
                            <p className="text-sm text-slate-500">Revenue and Expense analysis over time</p>
                        </div>
                        <RiskChart batchId={result.batchId} />
                    </div>

                    {/* Insights */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Analysis Insights</h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Risk Factors</h4>
                                <div className="space-y-3">
                                    {result.riskFactors ? result.riskFactors.split(' | ').map((factor, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-red-700 bg-red-50 p-4 rounded-lg text-sm border border-red-100">
                                            <AlertTriangle className="w-5 h-5 shrink-0" />
                                            <span>{factor}</span>
                                        </div>
                                    )) : <p className="text-slate-500 italic">No significant risks identified.</p>}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Recommendations</h4>
                                <div className="space-y-3">
                                    {result.recommendations ? result.recommendations.split(' | ').map((rec, idx) => (
                                        <div key={idx} className="flex items-start gap-3 text-emerald-700 bg-emerald-50 p-4 rounded-lg text-sm border border-emerald-100">
                                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                                            <span>{rec}</span>
                                        </div>
                                    )) : <p className="text-slate-500 italic">No recommendations available.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side Summary */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4">Analysis Summary</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Risk Level</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold 
                                    ${result.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                                        result.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                    {result.riskLevel}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Batch ID</p>
                                <p className="font-mono text-sm">{result.batchId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Analyzed Date</p>
                                <p className="text-sm">{new Date(result.analyzedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAnalysisPage;
