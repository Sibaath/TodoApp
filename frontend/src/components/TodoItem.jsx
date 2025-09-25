import React, { useState } from 'react';
import { Check, CreditCard as Edit3, Trash2, Calendar, Flag, Tag, MoreVertical } from 'lucide-react';
import { formatDueDate, getDueDateColor, getPriorityColor } from '../utils/todoUtils';

const TodoItem = ({ todo, onToggle, onEdit, onDelete, isDragging = false }) => {
  const [showActions, setShowActions] = useState(false);

  const handleToggle = () => onToggle(todo.id);
  const handleEdit = () => { onEdit(todo); setShowActions(false); };
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task: "${todo.title}"?`)) {
      onDelete(todo.id);
    }
    setShowActions(false);
  };

  return (
    <div
      className={`group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300 ${
        isDragging ? 'shadow-2xl rotate-1 scale-[1.02] border-blue-400' : ''
      } ${todo.status === 'completed' ? 'opacity-60 hover:opacity-100' : ''} transform hover:translate-y-[-2px]`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
            todo.status === 'completed'
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {todo.status === 'completed' && <Check size={16} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3
              className={`text-lg font-semibold text-gray-900 ${
                todo.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
              <Flag className="w-3 h-3 mr-1" />
              {todo.priority}
            </span>
          </div>

          {todo.description && (
            <p className={`text-sm text-gray-600 mb-3 ${todo.status === 'completed' ? 'line-through' : ''}`}>
              {todo.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-100">
            {todo.due_date && (
              <div className={`flex items-center gap-1 font-medium ${getDueDateColor(todo.due_date)}`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDueDate(todo.due_date)}</span>
              </div>
            )}
            
            {todo.category && (
              <div className="flex items-center gap-1 text-gray-500 font-medium">
                <Tag className="w-3 h-3" />
                <span>{todo.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="flex-shrink-0 relative mt-1">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1.5 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <MoreVertical size={20} />
          </button>

          {showActions && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-[140px] animate-in slide-in-from-top-1">
              <button
                onClick={handleEdit}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 rounded-t-lg transition-colors"
              >
                <Edit3 size={16} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-b-lg transition-colors"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default TodoItem;