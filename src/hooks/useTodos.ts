import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoFilter, TodoSort } from '../types/todo';
import { useSupabase } from './useSupabase';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabase();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const addTodo = useCallback(async (todoData: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'order_index'>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([todoData]);

      if (error) throw error;
      if (data) {
        setTodos(prev => [data[0], ...prev]);
      }
      return { success: true, data: data?.[0] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add todo';
      setError(message);
      return { success: false, error: message };
    }
  }, [supabase]);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      if (data) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? { ...todo, ...updates, updated_at: new Date().toISOString() } : todo
        ));
      }
      return { success: true, data: data?.[0] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      setError(message);
      return { success: false, error: message };
    }
  }, [supabase]);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTodos(prev => prev.filter(todo => todo.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(message);
      return { success: false, error: message };
    }
  }, [supabase]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return { success: false, error: 'Todo not found' };

    const newStatus = todo.status === 'completed' ? 'active' : 'completed';
    return updateTodo(id, { status: newStatus });
  }, [todos, updateTodo]);

  const reorderTodos = useCallback(async (reorderedTodos: Todo[]) => {
    try {
      // Update order_index for all todos
      const updates = reorderedTodos.map((todo, index) => ({
        ...todo,
        order_index: index,
        updated_at: new Date().toISOString()
      }));

      setTodos(updates);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reorder todos';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    refetch: fetchTodos
  };
};