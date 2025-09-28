import { useState, useCallback, useEffect } from 'react';
import api from '../config/api';

export const useDashboard = () => {
    const [stats, setStats] = useState({
        completedCount: 0,
        activeCount: 0,
        highPriorityCount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // This is the efficient backend endpoint for stats
            const response = await api.get('/todos/dashboard/stats');
            setStats(response.data);
        } catch (err) {
            setError(err.response?.data || "Failed to load dashboard stats.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Automatically fetch stats when the hook is used
    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, fetchStats };
};