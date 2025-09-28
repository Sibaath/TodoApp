import { useState, useCallback } from 'react';
import api from '../config/api';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [authError, setAuthError] = useState(null);

    const checkLoginStatus = useCallback(async () => {
        try {
            const response = await api.get('api/auth/profile');
            if (response.status === 200) {
                setUsername(response.data.username);
                setIsLoggedIn(true);
                return true;
            }
        } catch {
            setIsLoggedIn(false);
            setUsername('');
            return false;
        }
    }, []);

    // STEP 1 of SIGNUP: Get the challenge from the backend
    const startSignup = useCallback(async (username) => {
        setAuthError(null);
        try {
            const response = await api.post('api/auth/signup', { username });
            // Return the challenge details to the AuthScreen
            return { success: true, challenge: response.data };
        } catch (error) {
            const msg = error.response?.data || "Signup failed.";
            setAuthError(msg);
            return { success: false, error: msg };
        }
    }, []);

    // STEP 2 of SIGNUP: Submit challenge answer and user details
    const completeSignup = useCallback(async (signupData) => {
        setAuthError(null);
        try {
            // The submission includes all required fields for the backend
            const response = await api.post('api/auth/challenge/submit', signupData);

            if (response.status === 200) {
                setUsername(signupData.username);
                setIsLoggedIn(true);
                return { success: true };
            }
        } catch (error) {
            const msg = error.response?.data || "Challenge submission failed.";
            setAuthError(msg);
            setIsLoggedIn(false);
            return { success: false, error: msg };
        }
    }, []);

    // CORRECTED LOGIN
    const login = useCallback(async ({ username, password }) => {
        setAuthError(null);
        try {
            // In the backend, 'passwordHash' field expects the raw password
            const response = await api.post('api/auth/login', {
                username,
                passwordHash: password
            });

            if (response.status === 200) {
                setUsername(username);
                setIsLoggedIn(true);
                return { success: true };
            }
        } catch (error) {
            const msg = error.response?.data || "Invalid credentials.";
            setAuthError(msg);
            setIsLoggedIn(false);
            return { success: false, error: msg };
        }
        // This line is important for catching unexpected issues
        return { success: false, error: "Login failed." };
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/auth/logout'); // Call the backend logout
        } catch (error) {
            console.error("Logout failed, clearing client state anyway.", error);
        } finally {
            setIsLoggedIn(false);
            setUsername('');
        }
    }, []);

    return {
        isLoggedIn,
        username,
        authError,
        login,
        startSignup,
        completeSignup,
        logout,
        checkLoginStatus,
    };
};