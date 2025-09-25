import React, { useState, useEffect } from 'react';
import { HardHat } from 'lucide-react';

const AuthScreen = ({ onLogin, onSignup, setUsername }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showChallenge, setShowChallenge] = useState(false);
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [challengeAnswer, setChallengeAnswer] = useState('');
    const [challengeError, setChallengeError] = useState('');

    useEffect(() => {
        if (showChallenge) {
            setNum1(Math.floor(Math.random() * 10) + 5);
            setNum2(Math.floor(Math.random() * 10) + 2);
        }
    }, [showChallenge]);

    const handleAuthSubmit = (e) => {
        e.preventDefault();
        if (usernameInput.trim() === "" || passwordInput.trim() === "") {
            setChallengeError("Username and Password are required.");
            return;
        }
        setChallengeError("");
        setUsername(usernameInput);

        if (isLogin) {
            onLogin();
        } else {
            setShowChallenge(true);
        }
    };

    const handleChallengeSubmit = (e) => {
        e.preventDefault();
        if (parseInt(challengeAnswer) === (num1 * num2)) {
            setChallengeError("");
            onSignup();
        } else {
            setChallengeError("Incorrect! Try again.");
            setChallengeAnswer('');
            // Reset challenge numbers
            setNum1(Math.floor(Math.random() * 10) + 5);
            setNum2(Math.floor(Math.random() * 10) + 2);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setShowChallenge(false);
        setChallengeError('');
        setChallengeAnswer('');
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{isLogin ? 'Welcome Back' : 'Join Aura Task'}</h2>

            {!showChallenge ? (
                <form onSubmit={handleAuthSubmit} className="space-y-5">
                    <input
                        type="text"
                        placeholder="Username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    {challengeError && <p className="text-red-500 text-sm">{challengeError}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        {isLogin ? 'Login' : 'Continue to Challenge'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleChallengeSubmit} className="space-y-5 p-4 border border-blue-200 rounded-lg bg-blue-50">
                    <h3 className="text-xl font-semibold text-blue-800 flex items-center gap-2"><HardHat size={20} /> Bot Check</h3>
                    <p className="text-gray-700">Solve the multiplication puzzle to prove you're human:</p>
                    <div className="text-2xl font-bold text-center py-2 text-gray-800">
                        {num1} $\times$ {num2} = ?
                    </div>
                    <input
                        type="number"
                        placeholder="Your Answer"
                        value={challengeAnswer}
                        onChange={(e) => setChallengeAnswer(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition-all text-center text-lg"
                        required
                    />
                    {challengeError && <p className="text-red-500 text-sm text-center">{challengeError}</p>}
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-lg"
                    >
                        Verify & Sign Up
                    </button>
                </form>
            )}

            <p className="text-center text-sm mt-6 text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={toggleMode} className="text-blue-600 hover:underline ml-1 font-medium">
                    {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </p>
        </div>
    );
};

export default AuthScreen;