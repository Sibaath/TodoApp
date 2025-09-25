import { format, isToday, isTomorrow, isPast, parseISO } from 'date-fns';

// --- FILTERING ---
export const filterTodos = (todos, filter) => { 
  return todos.filter(todo => {
    if (filter.status !== 'all' && todo.status !== filter.status) return false;
    if (filter.priority && todo.priority !== filter.priority) return false;
    if (filter.category && todo.category !== filter.category) return false;

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(searchLower);
      const matchesDescription = todo.description?.toLowerCase().includes(searchLower); 
      const matchesCategory = todo.category?.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription && !matchesCategory) return false;
    }
    return true;
  });
};

// --- SORTING ---
export const sortTodos = (todos, sort) => { 
  return [...todos].sort((a, b) => {
    let aValue;
    let bValue;
    const priorityOrder = { high: 3, medium: 2, low: 1 };

    switch (sort.field) {
      case 'created_at': aValue = new Date(a.created_at).getTime(); bValue = new Date(b.created_at).getTime(); break;
      case 'due_date': aValue = a.due_date ? new Date(a.due_date).getTime() : Infinity; bValue = b.due_date ? new Date(b.due_date).getTime() : Infinity; break;
      case 'priority': aValue = priorityOrder[a.priority] || 0; bValue = priorityOrder[b.priority] || 0; break;
      case 'title': aValue = a.title.toLowerCase(); bValue = b.title.toLowerCase(); break;
      default: return 0;
    }

    if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// --- PRIORITY/DUE DATE HELPERS ---
export const getPriorityColor = (priority) => { 
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50 border-red-200';
    case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const formatDueDate = (dueDate) => { 
  if (!dueDate) return '';
  try {
    const date = parseISO(dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`;
    return format(date, 'MMM d, yyyy');
  } catch {
    return dueDate;
  }
};

export const getDueDateColor = (dueDate) => { 
  if (!dueDate) return 'text-gray-500';
  try {
    const date = parseISO(dueDate);
    if (isPast(date)) return 'text-red-600';
    if (isToday(date)) return 'text-orange-600';
    if (isTomorrow(date)) return 'text-blue-600';
    return 'text-gray-600';
  } catch {
    return 'text-gray-500';
  }
};

// --- VALIDATION ---
export const validateTodo = (todo) => { 
  const errors = []; 
  if (!todo.title || todo.title.trim().length === 0) errors.push('Title is required');
  if (todo.title && todo.title.trim().length > 200) errors.push('Title must be less than 200 characters');
  if (todo.description && todo.description.length > 1000) errors.push('Description must be less than 1000 characters');
  return { isValid: errors.length === 0, errors };
};