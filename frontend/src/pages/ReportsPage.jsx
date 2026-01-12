import React, { useEffect, useState } from 'react';
import { fetchHistory } from '../services/api';
import { FileText, Download } from 'lucide-react';

const ReportsPage = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const res = await fetchHistory();
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Reports</h1>

            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-800">Uploaded Datasets</h2>
                    </div>

                    {history.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500">No datasets uploaded yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Batch ID</th>
                                        <th className="px-6 py-4">Date Uploaded</th>
                                        <th className="px-6 py-4">Risk Level</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.slice().reverse().map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-slate-600">#{item.id}</td>
                                            <td className="px-6 py-4 text-slate-800">{new Date(item.analyzedAt).toLocaleDateString()} {new Date(item.analyzedAt).toLocaleTimeString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${item.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                                                        item.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {item.riskLevel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 text-slate-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Processed
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-primary-600 hover:text-primary-700 font-medium text-xs flex items-center gap-1 justify-end ml-auto">
                                                    <Download className="w-4 h-4" />
                                                    Export
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-800">Risk Analysis Reports</h2>
                    </div>
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        {history.length === 0 && <p className="text-slate-500">No reports generated yet</p>}
                        {history.length > 0 && <p className="text-slate-500">Select a dataset above to view full detailed reports.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
