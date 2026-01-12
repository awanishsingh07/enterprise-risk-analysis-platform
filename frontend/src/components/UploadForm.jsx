import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        try {
            const response = await uploadFile(file);
            onUploadSuccess(response.data);
            setFile(null);
        } catch (err) {
            console.error(err);
            setError("Upload failed. Please check the server logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                Upload Financial Data
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-slate-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-primary-50 file:text-primary-700
                                  hover:file:bg-primary-100"
                    />
                    <p className="mt-2 text-xs text-slate-400">Supported formats: CSV</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !file}
                    className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors
                        ${loading || !file
                            ? 'bg-slate-300 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                    {loading ? 'Analyzing...' : 'Upload & Analyze'}
                </button>
            </form>
        </div>
    );
};

export default UploadForm;
