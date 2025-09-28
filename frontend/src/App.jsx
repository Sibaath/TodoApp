// src/App.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'lucide-react';

// 1. IMPORT THE HOOKS FOR AUTHENTICATION AND DATA
import { useAuth } from './hooks/useAuth';
import { useTodos } from './hooks/useTodos';
import { useDashboard } from './hooks/useDashboard';

import { filterTodos, sortTodos } from './utils/todoUtils';

import LandingPage from './screens/LandingPage';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import TodoListScreen from './screens/TodoListScreen';
import Modal from './components/modal.jsx';
import TodoForm from './components/TodoForm';

function App() {
  // 2. USE THE AUTH HOOK FOR ALL AUTH-RELATED STATE AND FUNCTIONS
  //    This replaces your old useState for isLoggedIn and username.
  const {
    isLoggedIn,
    username,
    authError,
    login,
    startSignup,
    completeSignup,
    logout,
    checkLoginStatus,
  } = useAuth();

  // On initial load, check if the user is already logged in (from a previous session)
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Client-side page navigation state
  const [page, setPage] = useState('landing');

  // --- Data Fetching Hooks (only run if logged in) ---
  const { todos, loading, error, addTodo, updateTodo, deleteTodo } = useTodos(isLoggedIn);
  const { stats, loading: dashboardLoading } = useDashboard(isLoggedIn);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  const [filter, setFilter] = useState({ status: 'all', priority: undefined, category: undefined, search: '' });
  const [sort, setSort] = useState({ field: 'orderIndex', direction: 'asc' });

  // Memoized calculations remain the same
  const allCategories = useMemo(() => [...new Set(todos.map(t => t.category).filter(Boolean))], [todos]);
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = filterTodos(todos, filter);
    return sortTodos(filtered, sort);
  }, [todos, filter, sort]);

  // 3. CREATE A LOGOUT HANDLER THAT USES THE FUNCTION FROM THE HOOK
  const handleLogout = () => {
    logout();
    setPage('landing'); // Navigate to landing page after logout
  };

  // 4. USE AN EFFECT TO AUTOMATICALLY NAVIGATE WHEN LOGIN STATUS CHANGES
  useEffect(() => {
    if (isLoggedIn) {
      setPage('main'); // If user becomes logged in, switch to the main app view
    }
  }, [isLoggedIn]);

  const handleEditOpen = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleFormSubmit = async (data) => {
    const action = editingTodo ? updateTodo(editingTodo.id, data) : addTodo(data);
    const result = await action;
    if (result.success) {
      handleModalClose();
    }
    // Errors will be handled by the respective hooks
  };

  // --- RENDER LOGIC ---
  const renderContent = () => {
    if (!isLoggedIn) {
      if (page === 'landing') {
        return <LandingPage onLogin={() => setPage('login')} onSignup={() => setPage('signup')} />;
      } else {
        // 5. PASS THE CORRECT PROPS FROM THE useAuth HOOK TO AUTHSCREEN
        return (
          <AuthScreen
            login={login}
            startSignup={startSignup}
            completeSignup={completeSignup}
            authError={authError}
          />
        );
      }
    }

    // --- Logged In Views ---
    switch (page) {
      case 'profile':
        return <ProfileScreen username={username} onLogout={handleLogout} />;
      case 'dashboard':
        return <DashboardScreen stats={stats} loading={dashboardLoading} />;
      default: // 'main'
        return (
          <TodoListScreen
            todos={filteredAndSortedTodos}
            loading={loading} error={error}
            filter={filter} setFilter={setFilter}
            sort={sort} setSort={setSort}
            allCategories={allCategories}
            totalCount={todos.length}
            onAddOpen={() => { setEditingTodo(null); setIsModalOpen(true); }}
            onEditOpen={handleEditOpen}
            onDelete={deleteTodo}
          />
        );
    }
  };

  // --- MAIN RETURN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg fixed w-full z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-extrabold text-blue-600">Aura Task</h1>
            <div className="flex items-center space-x-4">
              <button onClick={() => setPage('main')} className={`px-3 py-1.5 rounded-lg font-medium ${page === 'main' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
              <button onClick={() => setPage('dashboard')} className={`px-3 py-1.5 rounded-lg font-medium ${page === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Dashboard</button>
              <button onClick={() => setPage('profile')} className={`p-2 rounded-full ${page === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-20 pb-8">{renderContent()}</main>

      {isModalOpen && (
        <Modal 
          title={editingTodo ? "Edit Task" : "Add New Task"} 
          onClose={handleModalClose}
        >
          <TodoForm
            initialData={editingTodo}
            onSubmit={handleFormSubmit}
            onCancel={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;