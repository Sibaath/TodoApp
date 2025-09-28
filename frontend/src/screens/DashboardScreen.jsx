import React from 'react';
import { BarChart, Loader2 } from 'lucide-react';

// This component now receives pre-calculated stats
const DashboardScreen = ({ stats, loading }) => {
    // Destructure the stats from the prop
    const { completedCount, activeCount, highPriorityCount } = stats;
    const totalCount = completedCount + activeCount;
    const completionRate = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    // Note: To build the priority bar, you would need the medium/low counts.
    // The backend endpoint should be updated to provide these if needed.
    // For now, we'll just display the high-priority count.

    if (loading) {
        return (
            <div className="text-center p-12 text-gray-500 flex justify-center items-center gap-2">
                <Loader2 size={24} className="animate-spin" /> Loading Dashboard...
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3"><BarChart size={24} /> Dashboard Overview</h2>
            
            {totalCount === 0 ? (
                 <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                    <p className="text-xl text-gray-600">Start adding tasks to see your stats!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1: Total */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-500">Active Tasks</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{activeCount}</p>
                    </div>

                    {/* Stat Card 2: Completed */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-green-500">
                        <p className="text-sm font-medium text-gray-500">Tasks Completed</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{completedCount}</p>
                    </div>

                    {/* Stat Card 3: High Priority */}
                     <div className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-red-500">
                        <p className="text-sm font-medium text-gray-500">High Priority</p>
                        <p className="text-4xl font-bold text-gray-900 mt-1">{highPriorityCount}</p>
                    </div>
                </div>
            )}
            {/* The rest of the component can stay as is, but should ideally use all stats from the backend */}
        </div>
    );
};

export default DashboardScreen;