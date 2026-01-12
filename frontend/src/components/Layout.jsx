import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Upload, AlertTriangle, FileText, BarChart3 } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/upload', label: 'Upload Data', icon: Upload },
        { path: '/analysis', label: 'Risk Analysis', icon: AlertTriangle },
        { path: '/reports', label: 'Reports', icon: FileText },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-primary-600">
                    <BarChart3 className="w-6 h-6" />
                    <span className="font-bold text-lg text-slate-900">Enterprise Risk Analysis</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                ? 'bg-primary-50 text-primary-700'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 text-center">Version 1.0.0 (MVP)</p>
            </div>
        </aside>
    );
};

const Layout = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="pl-64 transition-all duration-300">
                {/* Top header could go here if needed, keeping it simple for now as per screenshots which just show content area title */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
