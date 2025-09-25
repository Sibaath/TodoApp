import React, { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';

const LandingPage = ({ onLogin, onSignup }) => {
    const [scrollY, setScrollY] = useState(0);

    const handleScroll = useCallback(() => {
        setScrollY(window.scrollY);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Function for scroll-based opacity/transform animations
    const getAnimationProps = (trigger) => {
        const distance = 200;
        const opacity = Math.min(1, Math.max(0, (scrollY - trigger) / distance));
        const translateY = 50 * (1 - opacity);
        return { style: { opacity, transform: `translateY(${translateY}px)` }, className: "transition-all duration-500" };
    };

    return (
        <div className="min-h-[200vh] bg-gray-50">
            <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-blue-600 flex items-center gap-2">
                        Aura Task <Check size={28} className="text-green-500" />
                    </h1>
                    <div className="space-x-4">
                        <button onClick={onLogin} className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">Login</button>
                        <button onClick={onSignup} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">Sign Up</button>
                    </div>
                </div>
            </header>

            <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <section className="min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center text-center">
                    <div className="animate-in fade-in zoom-in duration-1000">
                        <p className="text-lg text-blue-600 font-semibold mb-3">Your Focus, Elevated</p>
                        <h2 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Master Your Day with <span className="text-blue-600">Aura Task</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-3xl">
                            The clean, intuitive todo app designed for effortless planning and tracking. Stop organizing, start achieving.
                        </p>
                        <button onClick={onSignup} className="px-8 py-4 bg-green-500 text-white text-lg rounded-xl font-bold hover:bg-green-600 transition-all shadow-xl transform hover:-translate-y-1">
                            Get Started Free
                        </button>
                    </div>
                </section>

                {/* Feature 1 */}
                <section {...getAnimationProps(600)} className="py-20 text-center">
                    <h3 className="text-4xl font-bold text-gray-800 mb-4">Intuitive Filters & Sorting</h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Quickly find what matters. Filter by status, priority, category, or search instantly.</p>
                </section>

                {/* Feature 2 */}
                <section {...getAnimationProps(1000)} className="py-20 text-center">
                    <h3 className="text-4xl font-bold text-gray-800 mb-4">Visual Progress Dashboard</h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">See your achievements at a glance with beautiful charts and completion metrics.</p>
                </section>
                
                {/* Feature 3 */}
                <section {...getAnimationProps(1400)} className="py-20 text-center">
                    <h3 className="text-4xl font-bold text-gray-800 mb-4">Security with a Twist</h3>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">Protected by a simple challenge during sign-up to keep the bots out and the productivity high.</p>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;