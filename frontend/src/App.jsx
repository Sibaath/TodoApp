import React, { useState, useMemo } from 'react';
import { User, LogOut, BarChart } from 'lucide-react';
import { useTodos } from './hooks/useTodos';
import { filterTodos, sortTodos } from './utils/todoUtils';

import LandingPage from './screens/LandingPage';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import DashboardScreen from './screens/DashboardScreen';
import TodoListScreen from './screens/TodoListScreen';

import Modal from './components/modal.jsx';
import TodoForm from './components/TodoForm';

function App() {
  // --- Global State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('demo_user');
  const [page, setPage] = useState('landing'); // 'landing', 'login', 'signup', 'main', 'profile', 'dashboard'

  // --- Todo State and Logic ---
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, toggleTodo, refetch } = useTodos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  
  // --- Filtering/Sorting State ---
  const [filter, setFilter] = useState({ status: 'all', priority: undefined, category: undefined, search: '' });
  const [sort, setSort] = useState({ field: 'created_at', direction: 'asc' });

  const allCategories = useMemo(() => [...new Set(todos.map(t => t.category).filter(Boolean))], [todos]);

  const filteredAndSortedTodos = useMemo(() => {
    let filtered = filterTodos(todos, filter);
    return sortTodos(filtered, sort);
  }, [todos, filter, sort]);

  // --- Navigation Handlers ---
  const handleLogin = () => { setIsLoggedIn(true); setPage('main'); };
  const handleSignup = () => { setIsLoggedIn(true); setPage('main'); };
  const handleLogout = () => { setIsLoggedIn(false); setPage('landing'); setUsername(''); };
  const navigateTo = (p) => setPage(p);

  // --- Todo Action Handlers ---
  const handleEditOpen = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleUpdate = async (data) => {
    if (editingTodo) {
        // Prepare data: remove IDs/timestamps that shouldn't be updated directly
        const { id, created_at, updated_at, order_index, ...updates } = data;
        return updateTodo(editingTodo.id, updates);
    }
    return { success: false, error: 'No task selected for update.' };
  };


  // --- Shared Layout (Navigation) ---
  const MainLayout = ({ children }) => (
    <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg fixed w-full z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <h1 className="text-2xl font-extrabold text-blue-600">Aura Task</h1>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigateTo('main')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${page === 'main' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Tasks</button>
                        <button onClick={() => navigateTo('dashboard')} className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${page === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>Dashboard</button>
                        <button onClick={() => navigateTo('profile')} className={`p-2 rounded-full transition-colors ${page === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        <main className="pt-20 pb-8">{children}</main>
    </div>
  );
  
  // --- Render Logic ---
  let content;
  
  if (!isLoggedIn) {
    if (page === 'landing') {
        content = <LandingPage onLogin={() => setPage('login')} onSignup={() => setPage('signup')} />;
    } else { // 'login' or 'signup'
        content = <AuthScreen onLogin={handleLogin} onSignup={handleSignup} setUsername={setUsername} />;
    }
  } else if (page === 'profile') {
    content = <ProfileScreen username={username} onLogout={handleLogout} />;
  } else if (page === 'dashboard') {
    content = <DashboardScreen todos={todos} />;
  } else {
    // 'main'
    content = (
        <TodoListScreen
            todos={filteredAndSortedTodos}
            loading={loading} error={error}
            filter={filter} setFilter={setFilter}
            sort={sort} setSort={setSort}
            allCategories={allCategories}
            totalCount={todos.length}
            onAddOpen={() => setIsModalOpen(true)}
            onEditOpen={handleEditOpen}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
        />
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <MainLayout>
      {content}
      
      {isModalOpen && (
        <Modal 
          title={editingTodo ? "Edit Task" : "Add New Task"} 
          onClose={handleModalClose}
        >
          <TodoForm
            initialData={editingTodo}
            isEditing={!!editingTodo}
            onSubmit={editingTodo ? handleUpdate : addTodo}
            onCancel={handleModalClose}
          />
        </Modal>
      )}
    </MainLayout>
  );
}

export default App;