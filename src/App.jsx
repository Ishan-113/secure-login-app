import { useState, useEffect } from 'react';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await fetch(`https://secure-login-app-lqhw.onrender.com/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          setToken(data.token);
          setMessage('Login successful!');
        } else {
          setMessage('Registered successfully! You can now login.');
          setIsLogin(true);
        }
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch (err) {
      setMessage('Server error: ' + err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetch('https://secure-login-app-lqhw.onrender.com/api/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setProfile(data.user))
        .catch((err) => console.log('Profile fetch error:', err));
    }
  }, [token]);

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
        <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
            {profile ? profile.username[0].toUpperCase() : '?'}
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Dashboard</h2>
          {profile ? (
            <p className="text-slate-300 mb-6">
              Welcome, <strong className="text-white">{profile.username}</strong>! 🎉
            </p>
          ) : (
            <p className="text-slate-400 mb-6">Loading profile...</p>
          )}
          <button
            onClick={() => { setToken(''); setProfile(null); }}
            className="w-full py-2.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-sm bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-16"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {showPassword ? '🙈 Hide' : '👁 Show'}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-lg shadow-indigo-600/20"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setIsLogin(!isLogin); setMessage(''); setUsername(''); setPassword(''); setShowPassword(false); }}
            className="text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>

        {message && (
          <p className="text-center text-sm mt-4 px-4 py-2 rounded-lg bg-slate-900/60 text-slate-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
