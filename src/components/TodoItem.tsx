import React, { useState } from 'react';
import { Todo } from '../types/todo';
import { formatDueDate, getDueDateColor, getPriorityColor } from '../utils/todoUtils';
import { Check, CreditCard as Edit3, Trash2, Calendar, Flag, Tag, MoreVertical } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete, isDragging = false }) => {
  const [showActions, setShowActions] = useState(false);

  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleEdit = () => {
    onEdit(todo);
    setShowActions(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(todo.id);
    }
    setShowActions(false);
  };

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
        isDragging ? 'shadow-lg rotate-2 scale-105' : ''
      } ${todo.status === 'completed' ? 'opacity-75' : ''}`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            todo.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
          }`}
        >
          {todo.status === 'completed' && <Check size={16} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`font-medium text-gray-900 ${
                todo.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
              <Flag className="w-3 h-3 mr-1" />
              {todo.priority}
            </span>
          </div>

          {/* Description */}
          {todo.description && (
            <p className={`text-sm text-gray-600 mb-3 ${todo.status === 'completed' ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {todo.due_date && (
              <div className={`flex items-center gap-1 ${getDueDateColor(todo.due_date)}`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDueDate(todo.due_date)}</span>
              </div>
            )}
            
            {todo.category && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>{todo.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={16} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 rounded-t-lg"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close actions */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default TodoItem;