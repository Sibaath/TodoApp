import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';
import { useDashboard } from './hooks/useDashboard';
// Assuming you have this utility file, otherwise filtering/sorting won't work
// import { filterTodos, sortTodos } from './utils/todoUtils';
import LandingPage from './screens/LandingPage';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import TodoListScreen from './screens/TodoListScreen';
import Modal from './components/modal.jsx';
import TodoForm from './components/TodoForm';

// Dummy filter/sort functions if the util file is missing
const filterTodos = (todos, filter) => todos;
const sortTodos = (todos, sort) => todos;


function App() {
  const { isLoggedIn, username, authError, login, startSignup, completeSignup, logout, checkLoginStatus } = useAuth();
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, toggleTodoStatus } = useTodos(isLoggedIn);
  const { stats, loading: dashboardLoading } = useDashboard(isLoggedIn);
  
  const [page, setPage] = useState('landing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filter, setFilter] = useState({ status: 'all', priority: undefined, category: undefined, search: '' });
  const [sort, setSort] = useState({ field: 'orderIndex', direction: 'asc' });

  useEffect(() => { checkLoginStatus(); }, [checkLoginStatus]);
  useEffect(() => { if (isLoggedIn) { setPage('main'); } }, [isLoggedIn]);

  const allCategories = useMemo(() => [...new Set(todos.map(t => t.category).filter(Boolean))], [todos]);
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = filterTodos(todos, filter);
    return sortTodos(filtered, sort);
  }, [todos, filter, sort]);

  const handleLogout = () => { logout(); setPage('landing'); };
  const handleEditOpen = (todo) => { setEditingTodo(todo); setIsModalOpen(true); };
  const handleModalClose = () => { setIsModalOpen(false); setEditingTodo(null); };
  
  const handleFormSubmit = async (data) => {
    const action = editingTodo ? updateTodo(editingTodo.id, data) : addTodo(data);
    const result = await action;
    if (result.success) { handleModalClose(); }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      if (page === 'landing') return <LandingPage onLogin={() => setPage('login')} onSignup={() => setPage('signup')} />;
      return <AuthScreen login={login} startSignup={startSignup} completeSignup={completeSignup} authError={authError} />;
    }

    // ✅ THIS IS THE LOGIC THAT MAKES THE DASHBOARD BUTTON WORK
    switch (page) {
      case 'profile': return <ProfileScreen username={username} onLogout={handleLogout} />;
      case 'dashboard': return <DashboardScreen stats={stats} loading={dashboardLoading} />;
      default: // 'main' page
        return (
          <TodoListScreen
            todos={filteredAndSortedTodos} loading={loading} error={error}
            filter={filter} setFilter={setFilter} sort={sort} setSort={setSort}
            allCategories={allCategories} totalCount={todos.length}
            onAddOpen={() => { setEditingTodo(null); setIsModalOpen(true); }}
            onEditOpen={handleEditOpen} onToggleStatus={toggleTodoStatus} onDelete={deleteTodo}
          />
        );
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {renderContent()}
      </div>
    );
  }

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-extrabold text-white">Aura Task</h1>
            <div className="flex items-center space-x-4">
              {/* ✅ THESE BUTTONS NOW CORRECTLY CHANGE THE 'page' STATE */}
              <button onClick={() => setPage('main')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${page === 'main' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>Tasks</button>
              <button onClick={() => setPage('dashboard')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${page === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>Dashboard</button>
              <button onClick={() => setPage('profile')} className={`p-2 rounded-full transition-colors ${page === 'profile' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-20 pb-8">{renderContent()}</main>

      {isModalOpen && (
        <Modal title={editingTodo ? "Edit Task" : "Add New Task"} onClose={handleModalClose}>
          <TodoForm initialData={editingTodo} onSubmit={handleFormSubmit} onCancel={handleModalClose} isEditing={!!editingTodo}/>
        </Modal>
      )}
    </div>
  );
}

export default App;