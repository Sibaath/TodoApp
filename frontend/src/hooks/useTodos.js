import { useState, useEffect, useCallback } from 'react';
import api from '../config/api';

export const useTodos = (isLoggedIn) => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        if (!isLoggedIn) {
            setTodos([]);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/todos');
            setTodos(response.data);
        } catch (err) {
            setError(err.response?.data || "Failed to load todos");
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn]);

    const addTodo = useCallback(async (todoData) => {
        try {
            const response = await api.post('/api/todos', todoData);
            setTodos((prev) => [...prev, response.data]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to add todo";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    const updateTodo = useCallback(async (id, updatedFields) => {
        try {
            const response = await api.put(`/api/todos/${id}`, updatedFields);
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? response.data : t))
            );
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to update todo";
            setError(errorMsg);
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
    
    // ✅ NEW: Function to toggle the 'completed' status of a todo
    const toggleTodoStatus = useCallback(async (todoToToggle) => {
        const newStatus = todoToToggle.status === 'completed' ? 'active' : 'completed';
        try {
            const response = await api.put(`/api/todos/${todoToToggle.id}`, { status: newStatus });
            setTodos((prev) =>
                prev.map((t) => (t.id === todoToToggle.id ? response.data : t))
            );
            return { success: true, data: response.data };
        } catch (err) {
            const errorMsg = err.response?.data || "Failed to update status";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    return { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo, toggleTodoStatus };
};