import React, { useState } from 'react';
import { HardHat, Loader2 } from 'lucide-react';

const AuthScreen = ({ login, startSignup, completeSignup, authError }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    
    // State for the challenge received from the backend
    const [challengeData, setChallengeData] = useState(null);
    const [challengeAnswer, setChallengeAnswer] = useState('');
    const [localError, setLocalError] = useState('');

    const resetForm = () => {
        setIsLoading(false);
        setUsernameInput('');
        setPasswordInput('');
        setChallengeData(null);
        setChallengeAnswer('');
        setLocalError('');
    };
    
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (!usernameInput || !passwordInput) {
            setLocalError("Username and Password are required.");
            return;
        }
        setLocalError('');
        setIsLoading(true);

        if (isLogin) {
            const result = await login({ username: usernameInput, password: passwordInput });
            if (!result.success) {
                setLocalError(result.error);
            }
        } else {
            // Start the signup process by getting a challenge
            const result = await startSignup(usernameInput);
            if (result.success) {
                setChallengeData(result.challenge);
            } else {
                setLocalError(result.error);
            }
        }
        setIsLoading(false);
    };

    const handleChallengeSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLocalError('');
        
        await completeSignup({
            username: usernameInput,
            password: passwordInput,
            challengeId: challengeData.challengeId,
            answer: parseInt(challengeAnswer, 10),
        });

        setIsLoading(false);
        // The global `authError` from the hook will be displayed if it fails
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    const displayError = localError || authError;

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{isLogin ? 'Welcome Back' : 'Join Aura Task'}</h2>

            {!challengeData ? (
                <form onSubmit={handleAuthSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                    />
                    {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center disabled:bg-gray-400"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Login' : 'Continue to Challenge')}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleChallengeSubmit} className="space-y-5 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2"><HardHat size={20} /> Bot Check</h3>
                    <p className="text-gray-700">Solve the puzzle to prove you're human:</p>
                    <div className="text-2xl font-bold text-center py-2 text-gray-800">
                        {challengeData.num1} &times; {challengeData.num2} = ?
                    </div>
                    <input
                        type="number"
                        placeholder="Your Answer"
                        value={challengeAnswer}
                        onChange={(e) => setChallengeAnswer(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-center text-lg"
                        required
                        disabled={isLoading}
                    />
                    {displayError && <p className="text-red-500 text-sm text-center">{displayError}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center disabled:bg-gray-400"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Sign Up'}
                    </button>
                </form>
            )}

            <p className="text-center text-sm mt-6 text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleMode} className="text-blue-600 hover:underline ml-1 font-medium" disabled={isLoading}>
                    {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </div>
    );
};

export default AuthScreen;