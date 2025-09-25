export interface Todo {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed';
  category?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  order_index: number;
}

export interface TodoFilter {
  status: 'all' | 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  search: string;
}

export interface TodoSort {
  field: 'created_at' | 'due_date' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}

export interface User {
  id: string;
  username: string;
  email?: string;
  created_at: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}