import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { User, RegisterRequest, LoginRequest } from '../types/auth';
import { authService } from '../services/auth.service';

// Constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const TOAST_DURATION = 4000;

// Types
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

    // Auto-login on mount if token exists
    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
            }
        }
    }, []);

    const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastSeverity(severity);
        setToastOpen(true);
    };

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authService.login(data);
            setUser(response.user);
            localStorage.setItem(TOKEN_KEY, response.token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
            showToast('Session started successfully!', 'success');
        } catch (error: any) {
            // Error will be handled by the modal component
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await authService.register(data);
            setUser(response.user);
            localStorage.setItem(TOKEN_KEY, response.token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
            showToast('Account created successfully!', 'success');
        } catch (error: any) {
            // Error will be handled by the modal component
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        showToast('Closed session successfully', 'success');
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            <Snackbar
                open={toastOpen}
                autoHideDuration={TOAST_DURATION}
                onClose={() => setToastOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
