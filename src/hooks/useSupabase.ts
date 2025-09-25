import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { Todo, User } from '../types/todo';

// Note: In a real app, these would be environment variables
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

// For demo purposes, we'll use a mock client
const createMockSupabaseClient = () => {
  let todos: Todo[] = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write and review the Q1 project proposal document',
      due_date: '2024-02-15',
      priority: 'high',
      status: 'active',
      category: 'Work',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      order_index: 0
    },
    {
      id: '2',
      title: 'Review team feedback',
      description: 'Go through all team feedback from last sprint',
      due_date: '2024-02-10',
      priority: 'medium',
      status: 'completed',
      category: 'Work',
      created_at: '2024-01-14T09:00:00Z',
      updated_at: '2024-01-16T14:30:00Z',
      order_index: 1
    },
    {
      id: '3',
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      due_date: '2024-02-20',
      priority: 'medium',
      status: 'active',
      category: 'Development',
      created_at: '2024-01-13T11:00:00Z',
      updated_at: '2024-01-13T11:00:00Z',
      order_index: 2
    },
    {
      id: '4',
      title: 'Schedule dentist appointment',
      description: 'Book routine dental checkup',
      due_date: '2024-02-25',
      priority: 'low',
      status: 'active',
      category: 'Personal',
      created_at: '2024-01-12T16:00:00Z',
      updated_at: '2024-01-12T16:00:00Z',
      order_index: 3
    },
    {
      id: '5',
      title: 'Prepare presentation slides',
      description: 'Create slides for the quarterly review meeting',
      due_date: '2024-02-18',
      priority: 'high',
      status: 'active',
      category: 'Work',
      created_at: '2024-01-11T13:00:00Z',
      updated_at: '2024-01-11T13:00:00Z',
      order_index: 4
    }
  ];

  let users: User[] = [
    {
      id: '1',
      username: 'demo_user',
      email: 'demo@example.com',
      created_at: '2024-01-01T00:00:00Z',
      preferences: {
        theme: 'light',
        notifications: true
      }
    }
  ];

  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, options?: { ascending?: boolean }) => ({
            data: table === 'todos' ? todos : users,
            error: null
          })
        }),
        order: (column: string, options?: { ascending?: boolean }) => ({
          data: table === 'todos' ? todos : users,
          error: null
        }),
        data: table === 'todos' ? todos : users,
        error: null
      }),
      insert: (data: any) => {
        if (table === 'todos') {
          const newTodo = {
            ...data,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            order_index: todos.length
          };
          todos.unshift(newTodo);
          return { data: [newTodo], error: null };
        }
        return { data: null, error: null };
      },
      update: (data: any) => ({
        eq: (column: string, value: any) => {
          if (table === 'todos') {
            const index = todos.findIndex(todo => todo.id === value);
            if (index !== -1) {
              todos[index] = { ...todos[index], ...data, updated_at: new Date().toISOString() };
              return { data: [todos[index]], error: null };
            }
          }
          return { data: null, error: null };
        }
      }),
      delete: () => ({
        eq: (column: string, value: any) => {
          if (table === 'todos') {
            const index = todos.findIndex(todo => todo.id === value);
            if (index !== -1) {
              const deleted = todos.splice(index, 1);
              return { data: deleted, error: null };
            }
          }
          return { data: null, error: null };
        }
      })
    })
  };
};

export const useSupabase = () => {
  const [client] = useState(() => createMockSupabaseClient());
  
  return client;
};