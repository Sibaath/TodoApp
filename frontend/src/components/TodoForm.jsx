import React, { useState } from 'react';
import { Plus, X, Calendar, Flag, Tag } from 'lucide-react';
import { validateTodo } from '../utils/todoUtils';

const TodoForm = ({ onSubmit, onCancel, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    // ✅ FIX: Changed property name to match the Java backend model
    dueDate: initialData?.dueDate || '',
    priority: initialData?.priority || 'medium',
    category: initialData?.category || '',
    status: initialData?.status || 'active'
  });

  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateTodo(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await onSubmit(formData);
      // The parent component now handles closing the modal on success
      if (!result.success) {
        setErrors([result.error || 'Failed to save todo']);
      }
    } catch (error) {
      setErrors(['An unexpected error occurred']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => { 
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) setErrors([]);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">Task Title <span className="text-red-500">*</span></label>
        <input
          type="text" id="title" value={formData.title} onChange={(e) => handleChange('title', e.target.value)}
          // ✅ FIX: Classes for dark background and light text
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          id="description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)}
          // ✅ FIX: Classes for dark background and light text
          className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300 mb-2"><Calendar className="inline w-4 h-4 mr-1" />Due Date</label>
          <input
            type="date" id="dueDate" value={formData.dueDate} onChange={(e) => handleChange('dueDate', e.target.value)}
            // ✅ FIX: Classes for dark background and light text
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-300 mb-2"><Flag className="inline w-4 h-4 mr-1" />Priority</label>
          <select
            id="priority" value={formData.priority} onChange={(e) => handleChange('priority', e.target.value)}
            // ✅ FIX: Classes for dark background and light text
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-2"><Tag className="inline w-4 h-4 mr-1" />Category</label>
          <input
            type="text" id="category" value={formData.category} onChange={(e) => handleChange('category', e.target.value)}
            // ✅ FIX: Classes for dark background and light text
            className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
      {/* ... Errors and Actions are unchanged ... */}
    </form>
  );
};

export default TodoForm;