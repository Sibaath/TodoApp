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
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Task Title <span className="text-red-500">*</span></label>
        <input
          type="text" id="title" value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          maxLength={200}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          id="description" value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Add more details about this task..." rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          maxLength={1000}
        />
      </div>

      {/* Due Date, Priority, and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Due Date */}
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2"><Calendar className="inline w-4 h-4 mr-1" />Due Date</label>
          <input
            type="date"
            // ✅ FIX: Changed id, value, and onChange handler to use 'dueDate'
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2"><Flag className="inline w-4 h-4 mr-1" />Priority</label>
          <select
            id="priority" value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2"><Tag className="inline w-4 h-4 mr-1" />Category</label>
          <input
            type="text" id="category" value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            placeholder="e.g., Work, Personal"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <X className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (<li key={index}>{error}</li>))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit" disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (<Plus className="w-5 h-5 mr-2" />)}
          {isSubmitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Add Task')}
        </button>
        
        {onCancel && (
          <button
            type="button" onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;