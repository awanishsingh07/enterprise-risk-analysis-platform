import React from 'react';
import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

const UploadPage = () => {
    const navigate = useNavigate();

    const handleUploadSuccess = (result) => {
        // Navigate to Analysis page to show results
        navigate('/analysis', { state: { result } });
    };

    return (
        <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Upload Data</h1>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-2">Supported Formats</h2>
                    <div className="flex gap-6 text-slate-600 text-sm">
                        <span className="flex items-center gap-2">
                            <span className="p-1 bg-green-100 rounded text-green-700">CSV</span>
                            CSV Files (.csv)
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="p-1 bg-blue-100 rounded text-blue-700">XLS</span>
                            Excel Files (.xlsx, .xls)
                        </span>
                    </div>
                </div>

                {/* We re-use the existing UploadForm but might need to styling tweaks if we want to match screenshot 100% which has a big drag drop */}
                {/* For MVP, wrapping existing form is safest first step */}
                <UploadForm onUploadSuccess={handleUploadSuccess} />
            </div>
        </div>
    );
};

export default UploadPage;
