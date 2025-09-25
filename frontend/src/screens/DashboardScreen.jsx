import React from 'react';
import { BarChart, AlertTriangle } from 'lucide-react';

const DashboardScreen = ({ todos }) => {
    const totalCount = todos.length;
    const completedCount = todos.filter(t => t.status === 'completed').length;
    const activeCount = totalCount - completedCount;
    const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    const highPriorityCount = todos.filter(t => t.priority === 'high').length;
    const mediumPriorityCount = todos.filter(t => t.priority === 'medium').length;
    const lowPriorityCount = todos.filter(t => t.priority === 'low').length;

    // Simple textual representation of a "Pie Chart" using flexbox/colors
    const PriorityBar = () => (
        <div className="flex w-full h-8 rounded-lg overflow-hidden shadow-inner">
            <div 
                className="bg-red-500 text-white text-xs font-bold flex items-center justify-center min-w-[5%]" 
                style={{ width: `${(highPriorityCount / totalCount) * 100}%` }}
            >
                {highPriorityCount > 0 && `${Math.round((highPriorityCount / totalCount) * 100)}%`}
            </div>
            <div 
                className="bg-yellow-500 text-white text-xs font-bold flex items-center justify-center min-w-[5%]" 
                style={{ width: `${(mediumPriorityCount / totalCount) * 100}%` }}
            >
                {mediumPriorityCount > 0 && `${Math.round((mediumPriorityCount / totalCount) * 100)}%`}
            </div>
            <div 
                className="bg-green-500 text-white text-xs font-bold flex items-center justify-center min-w-[5%]" 
                style={{ width: `${(lowPriorityCount / totalCount) * 100}%` }}
            >
                {lowPriorityCount > 0 && `${Math.round((lowPriorityCount / totalCount) * 100)}%`}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 space-y-8 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3"><BarChart size={24} /> Dashboard Overview</h2>
            
            {totalCount === 0 ? (
                <div className="text-center p-12 bg-white rounded-xl shadow-lg border border-gray-200">
                    <p className="text-xl text-gray-600 font-medium">Start adding tasks to see your stats!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1: Total */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-500 transition-transform hover:scale-[1.02]">
                        <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{totalCount}</p>
                    </div>

                    {/* Stat Card 2: Completed */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500 transition-transform hover:scale-[1.02]">
                        <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{completedCount}</p>
                    </div>

                    {/* Stat Card 3: Completion Rate */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-purple-500 transition-transform hover:scale-[1.02]">
                        <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                        <p className="text-4xl font-bold text-purple-600 mt-1">{completionRate}%</p>
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                <h3 className="text-xl font-semibold text-gray-800">Task Breakdown by Priority</h3>
                <p className="text-sm text-gray-500">Percentage distribution of all tasks:</p>
                {totalCount > 0 ? <PriorityBar /> : <p className="text-gray-400">No tasks to break down.</p>}
                
                <div className="grid grid-cols-3 gap-4 text-center pt-2">
                    <div className="border border-red-200 bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-600 font-bold">High</p>
                        <p className="text-2xl font-bold text-gray-800">{highPriorityCount}</p>
                    </div>
                    <div className="border border-yellow-200 bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-yellow-600 font-bold">Medium</p>
                        <p className="text-2xl font-bold text-gray-800">{mediumPriorityCount}</p>
                    </div>
                    <div className="border border-green-200 bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600 font-bold">Low</p>
                        <p className="text-2xl font-bold text-gray-800">{lowPriorityCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;