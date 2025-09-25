import React from 'react';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';

import TodoFilters from '../components/TodoFilters';
import TodoItem from '../components/TodoItem';

const TodoListScreen = ({
    todos, loading, error, 
    filter, setFilter, sort, setSort, 
    allCategories, totalCount,
    onAddOpen, onEditOpen, onToggle, onDelete
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">My Tasks</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar / Filters */}
                <div className="lg:col-span-1">
                    <TodoFilters
                        filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort}
                        categories={allCategories} totalCount={totalCount} filteredCount={todos.length}
                    />
                </div>

                {/* Main Todo List */}
                <div className="lg:col-span-3 space-y-4">
                    {/* New Task Button */}
                    <button
                        onClick={onAddOpen}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} /> Add New Task
                    </button>
                    
                    {loading && (
                        <div className="text-center p-8 text-gray-500 flex justify-center items-center gap-2">
                            <Loader2 size={24} className="animate-spin" /> Loading Tasks...
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                            <AlertTriangle size={20} /> Error: {error}
                        </div>
                    )}

                    {!loading && todos.length === 0 && (
                        <div className="text-center p-8 text-gray-500 bg-white rounded-xl shadow-md">
                            No tasks match your current filters.
                        </div>
                    )}

                    {/* List of Tasks */}
                    <div className="space-y-3">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id} todo={todo}
                                onToggle={onToggle} onEdit={onEditOpen} onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoListScreen;