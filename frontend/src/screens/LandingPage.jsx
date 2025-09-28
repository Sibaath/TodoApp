import React from 'react';
import { Check, ArrowRight, Filter, BarChart3, ShieldCheck } from 'lucide-react';

const LandingPage = ({ onLogin, onSignup }) => {
    return (
        <div className="bg-slate-900 text-slate-300">
            {/* Header */}
            <header className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
                        Aura Task
                    </h1>
                    <div className="space-x-2 sm:space-x-4">
                        <button onClick={onLogin} className="px-4 py-2 text-slate-300 rounded-lg font-medium hover:bg-slate-800 transition-colors">Login</button>
                        <button onClick={onSignup} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">Sign Up Free</button>
                    </div>
                </div>
            </header>

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_0%,transparent_100%)]"></div>
                    <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000">
                        <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                            Clarity in Chaos. <br /> Achieve with <span className="text-blue-500">Aura Task</span>.
                        </h2>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto">
                            An intuitive, fast, and beautiful todo app designed to get out of your way, so you can focus on what truly matters.
                        </p>
                        <button onClick={onSignup} className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl transform hover:-translate-y-1 flex items-center gap-2 mx-auto">
                            Get Started Now <ArrowRight size={20} />
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-slate-900 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="font-semibold text-blue-500">FEATURES</p>
                            <h3 className="text-4xl font-extrabold text-white mt-2">Everything You Need to Succeed</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                                <Filter size={32} className="mx-auto text-blue-500 mb-4" />
                                <h4 className="text-2xl font-bold text-white mb-2">Advanced Filtering</h4>
                                <p className="text-slate-400">Instantly find any task with powerful search, status, priority, and category filters.</p>
                            </div>
                            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                                <BarChart3 size={32} className="mx-auto text-blue-500 mb-4" />
                                <h4 className="text-2xl font-bold text-white mb-2">Insightful Dashboard</h4>
                                <p className="text-slate-400">Visualize your productivity and track your progress with a clean, simple dashboard.</p>
                            </div>
                            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
                                <ShieldCheck size={32} className="mx-auto text-blue-500 mb-4" />
                                <h4 className="text-2xl font-bold text-white mb-2">Secure by Design</h4>
                                <p className="text-slate-400">Your data is yours. With secure authentication and a bot-check challenge, your focus is protected.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* CTA Section */}
                <section className="py-24 px-4">
                     <div className="text-center">
                        <h3 className="text-4xl font-extrabold text-white">Ready to Organize Your Life?</h3>
                        <p className="text-lg text-slate-400 mt-4 mb-8">Join thousands of users who have found their focus with Aura Task.</p>
                         <button onClick={onSignup} className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl transform hover:-translate-y-1">
                            Sign Up - It's Free
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;