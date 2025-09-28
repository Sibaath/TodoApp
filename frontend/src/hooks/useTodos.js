import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';

// The isLoggedIn parameter ensures we only fetch data when the user is logged in.
export const useTodos = (isLoggedIn) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        if (!isLoggedIn) {
            setTodos([]); // Clear todos if not logged in
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/todos'); // Ensure full path is used if needed
            setTodos(response.data);
        } catch (err) {
            setError(err.response?.data || "Failed to load todos");
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]); // Dependency array includes isLoggedIn

    const addTodo = useCallback(async (todoData) => {
        try {
            const response = await api.post('/api/todos', todoData);
            setTodos((prev) => [...prev, response.data]);
            // ✅ RETURN a success object
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to add todo";
            setError(errorMsg);
            // ✅ RETURN a failure object
            return { success: false, error: errorMsg };
        }
    }, []);

    const updateTodo = useCallback(async (id, updatedFields) => {
        try {
            const response = await api.put(`/api/todos/${id}`, updatedFields);
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? response.data : t))
            );
            // ✅ RETURN a success object
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to update todo";
            setError(errorMsg);
            // ✅ RETURN a failure object
            return { success: false, error: errorMsg };
        }
    }, []);

    const deleteTodo = useCallback(async (id) => {
        try {
            await api.delete(`/api/todos/${id}`);
            setTodos((prev) => prev.filter((t) => t.id !== id));
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to delete todo";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]); // fetchTodos is stable due to its own dependency on isLoggedIn

    return { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo };
};