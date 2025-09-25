import { Todo, TodoFilter, TodoSort } from '../types/todo';
import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

export const filterTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  return todos.filter(todo => {
    // Status filter
    if (filter.status !== 'all' && todo.status !== filter.status) {
      return false;
    }

    // Priority filter
    if (filter.priority && todo.priority !== filter.priority) {
      return false;
    }

    // Category filter
    if (filter.category && todo.category !== filter.category) {
      return false;
    }

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(searchLower);
      const matchesDescription = todo.description?.toLowerCase().includes(searchLower);
      const matchesCategory = todo.category?.toLowerCase().includes(searchLower);
      
      if (!matchesTitle && !matchesDescription && !matchesCategory) {
        return false;
      }
    }

    return true;
  });
};

export const sortTodos = (todos: Todo[], sort: TodoSort): Todo[] => {
  return [...todos].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sort.field) {
      case 'created_at':
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
        break;
      case 'due_date':
        aValue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        bValue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getPriorityColor = (priority: Todo['priority']) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPriorityIcon = (priority: Todo['priority']) => {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
};

export const formatDueDate = (dueDate: string | undefined): string => {
  if (!dueDate) return '';
  
  try {
    const date = parseISO(dueDate);
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isPast(date)) {
      return `Overdue (${format(date, 'MMM d')})`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  } catch {
    return dueDate;
  }
};

export const getDueDateColor = (dueDate: string | undefined): string => {
  if (!dueDate) return 'text-gray-500';
  
  try {
    const date = parseISO(dueDate);
    
    if (isPast(date)) {
      return 'text-red-600';
    } else if (isToday(date)) {
      return 'text-orange-600';
    } else if (isTomorrow(date)) {
      return 'text-blue-600';
    } else {
      return 'text-gray-600';
    }
  } catch {
    return 'text-gray-500';
  }
};

export const validateTodo = (todo: Partial<Todo>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!todo.title || todo.title.trim().length === 0) {
    errors.push('Title is required');
  }

  if (todo.title && todo.title.trim().length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  if (todo.description && todo.description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (todo.due_date) {
    try {
      const date = parseISO(todo.due_date);
      if (isNaN(date.getTime())) {
        errors.push('Invalid due date format');
      }
    } catch {
      errors.push('Invalid due date format');
    }
  }

  if (todo.priority && !['low', 'medium', 'high'].includes(todo.priority)) {
    errors.push('Invalid priority level');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};