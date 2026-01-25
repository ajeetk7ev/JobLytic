import { useAuthStore } from '@/store/authStore'
import React from 'react'
import { Navigate } from 'react-router-dom';

interface RouteProps {
    children: React.ReactNode
}

function OpenRoute({ children }: RouteProps) {
    const { isAuthenticated, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return children;
    } else {
        return <Navigate to="/dashboard" />;
    }
}

export default OpenRoute;