import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import ReportsPage from './pages/ReportsPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="upload" element={<UploadPage />} />
                    <Route path="analysis" element={<RiskAnalysisPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    {/* Redirect unknown routes to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
