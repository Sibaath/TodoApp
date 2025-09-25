import React from 'react';
import { Search, Filter, Import as SortAsc, Dessert as SortDesc, X } from 'lucide-react';

const TodoFilters = ({ filter, sort, onFilterChange, onSortChange, categories, totalCount, filteredCount }) => {
  const handleStatusFilter = (status) => onFilterChange({ ...filter, status });
  const handlePriorityFilter = (priority) => onFilterChange({ ...filter, priority: priority === filter.priority ? undefined : priority });
  const handleCategoryFilter = (category) => onFilterChange({ ...filter, category: category === filter.category ? undefined : category });
  const handleSearchChange = (search) => onFilterChange({ ...filter, search });

  const handleSortChange = (field) => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  const clearFilters = () => onFilterChange({ status: 'all', priority: undefined, category: undefined, search: '' });

  const hasActiveFilters = filter.status !== 'all' || filter.priority || filter.category || filter.search;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 sticky top-20"> {/* Added sticky for better UX */}
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={filter.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2"><Filter size={16} />Status</h3>
        <div className="flex flex-wrap gap-2">
          {(['all', 'active', 'completed']).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter.status === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Priority</h3>
        <div className="flex flex-wrap gap-2">
          {(['high', 'medium', 'low']).map((priority) => (
            <button
              key={priority}
              onClick={() => handlePriorityFilter(priority)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize flex items-center gap-2 ${
                filter.priority === priority
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {priority === 'high' && '🔴'}
              {priority === 'medium' && '🟡'}
              {priority === 'low' && '🟢'}
              {priority}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter.category === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sort By</h3>
        <div className="flex flex-wrap gap-2">
          {([
            { field: 'created_at', label: 'Created' },
            { field: 'due_date', label: 'Due Date' },
            { field: 'priority', label: 'Priority' },
            { field: 'title', label: 'Title' }
          ]).map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSortChange(field)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                sort.field === field
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
              {sort.field === field && (
                sort.direction === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary and Clear Filters */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing <span className="font-bold">{filteredCount}</span> of <span className="font-bold">{totalCount}</span> tasks
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoFilters;