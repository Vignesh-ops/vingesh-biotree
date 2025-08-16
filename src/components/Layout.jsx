import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useState, useEffect } from 'react';

const Layout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        // Store sidebar state in localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState) setSidebarCollapsed(JSON.parse(savedState));
    }, []);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar 
                    collapsed={sidebarCollapsed} 
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
                
                <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
                    sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
                } pb-16 md:pb-0`}>
                    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8 min-h-auto">
                        <Outlet />
                    </div>
                    {/* <Footer /> */}
                </main>
            </div>
        </div>
    );
}

export default Layout;