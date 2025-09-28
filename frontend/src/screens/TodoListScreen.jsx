import React from 'react';
import { Plus, Loader2, AlertTriangle } from 'lucide-react';
import TodoFilters from '../components/TodoFilters';
import TodoItem from '../components/TodoItem';

const TodoListScreen = ({
    todos, loading, error, 
    filter, setFilter, sort, setSort, 
    allCategories, totalCount,
    onAddOpen, onEditOpen, 
    onToggleStatus, 
    onDelete 
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
            {/* ✅ FIX: Changed text-gray-800 to text-white for visibility */}
            <h2 className="text-3xl font-bold text-white">My Tasks</h2>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg-col-span-1">
                    <TodoFilters
                        filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort}
                        categories={allCategories} totalCount={totalCount} filteredCount={todos.length}
                    />
                </div>
                <div className="lg:col-span-3 space-y-4">
                    <button
                        onClick={onAddOpen}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <Plus size={20} /> Add New Task
                    </button>
                    
                    {loading && (
                        <div className="text-center p-8 text-slate-400 flex justify-center items-center gap-2">
                            <Loader2 size={24} className="animate-spin" /> Loading Tasks...
                        </div>
                    )}
                    
                    {error && (
                        <div className="p-4 bg-red-900/50 text-red-300 rounded-lg flex items-center gap-2">
                            <AlertTriangle size={20} /> Error: {error}
                        </div>
                    )}

                    {!loading && todos.length === 0 && (
                        <div className="text-center p-8 text-slate-500 bg-slate-800 border border-slate-700 rounded-xl shadow-md">
                            No tasks match your current filters.
                        </div>
                    )}

                    <div className="space-y-3">
                        {todos.map((todo) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggleStatus={onToggleStatus}
                                onEdit={onEditOpen}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TodoListScreen;