import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../services/api';
import { LogIn, User, Lock } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [registerNumber, setRegisterNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(registerNumber, password);
            router.push('/dashboard/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please verify credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Student Portal</h2>
                    <p>Access your Student Portal</p>
                </div>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Register Number"
                            value={registerNumber}
                            onChange={(e) => setRegisterNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : (
                            <>
                                <LogIn size={20} style={{ marginRight: '8px' }} />
                                Login
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
