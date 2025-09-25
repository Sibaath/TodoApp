import { useState } from 'react';

// --- MOCK TODO DATA ---
let mockTodos = [
    { id: '1', title: 'Complete project proposal', description: 'Write and review Q1 project proposal', due_date: '2024-12-15', priority: 'high', status: 'active', category: 'Work', created_at: '2024-01-15T10:00:00Z', updated_at: '2024-01-15T10:00:00Z', order_index: 0 },
    { id: '2', title: 'Review team feedback', description: 'Go through all team feedback from last sprint', due_date: '2024-11-10', priority: 'medium', status: 'completed', category: 'Work', created_at: '2024-01-14T09:00:00Z', updated_at: '2024-01-16T14:30:00Z', order_index: 1 },
    { id: '3', title: 'Update documentation', description: 'Update API documentation with new endpoints', due_date: '2025-01-20', priority: 'medium', status: 'active', category: 'Development', created_at: '2024-01-13T11:00:00Z', updated_at: '2024-01-13T11:00:00Z', order_index: 2 },
    { id: '4', title: 'Schedule dentist appointment', description: 'Book routine dental checkup', due_date: '2024-10-25', priority: 'low', status: 'active', category: 'Personal', created_at: '2024-01-12T16:00:00Z', updated_at: '2024-01-12T16:00:00Z', order_index: 3 },
    { id: '5', title: 'Prepare presentation slides', description: 'Create slides for the quarterly review meeting', due_date: '2024-12-18', priority: 'high', status: 'active', category: 'Work', created_at: '2024-01-11T13:00:00Z', updated_at: '2024-01-11T13:00:00Z', order_index: 4 }
];
let mockUsers = [{ id: '1', username: 'demo_user' }];

const createMockSupabaseClient = () => {
  return {
    from: (table) => ({
      select: () => ({
        order: () => ({
          data: table === 'todos' ? mockTodos : mockUsers,
          error: null
        }),
        data: table === 'todos' ? mockTodos : mockUsers,
        error: null
      }),
      insert: (data) => {
        if (table === 'todos') {
          const newTodo = {
            ...data,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            order_index: mockTodos.length
          };
          mockTodos.unshift(newTodo);
          return { data: [newTodo], error: null };
        }
        return { data: null, error: null };
      },
      update: (data) => ({
        eq: (column, value) => {
          if (table === 'todos') {
            const index = mockTodos.findIndex(todo => todo.id === value);
            if (index !== -1) {
              mockTodos[index] = { ...mockTodos[index], ...data, updated_at: new Date().toISOString() };
              return { data: [mockTodos[index]], error: null };
            }
          }
          return { data: null, error: null };
        }
      }),
      delete: () => ({
        eq: (column, value) => {
          if (table === 'todos') {
            const index = mockTodos.findIndex(todo => todo.id === value);
            if (index !== -1) {
              const deleted = mockTodos.splice(index, 1);
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