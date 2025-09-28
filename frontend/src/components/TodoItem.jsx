import React, { useEffect, useState } from 'react';
import { Check, Edit, Trash2, Calendar, Flag, Tag } from 'lucide-react';
import './TodoItem.css'; // ✅ CRITICAL: This line imports the animations and styles.

const TodoItem = ({ todo, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = todo.status === 'completed';
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !isCompleted;
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const cardClasses = `TodoItem ${isCompleted ? 'is-completed' : ''} ${isOverdue ? 'is-overdue' : ''} ${animate ? 'animate-in' : ''}`;
  const priorityMap = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

  return (
    <div className={cardClasses}>
      <div className="checkbox" onClick={() => onToggleStatus(todo)}>
        <Check className="icon" size={16} strokeWidth={3} />
      </div>
      <div className="content">
        <p className="title">{todo.title}</p>
        {todo.description && <p className="description">{todo.description}</p>}
        <div className="meta">
          {todo.dueDate && <span><Calendar size={12} className="inline mr-1" />{todo.dueDate}</span>}
          {todo.priority && <span><Flag size={12} className="inline mr-1" />{priorityMap[todo.priority]}</span>}
          {todo.category && <span><Tag size={12} className="inline mr-1" />{todo.category}</span>}
        </div>
      </div>
      <div className="actions">
        <button onClick={() => onEdit(todo)} aria-label="Edit task"><Edit size={16} /></button>
        <button onClick={() => onDelete(todo.id)} aria-label="Delete task"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

export default TodoItem;