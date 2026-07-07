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
      <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
        <h2>Dashboard</h2>
        {profile ? (
          <p>Welcome, <strong>{profile.username}</strong>! 🎉</p>
        ) : (
          <p>Loading profile...</p>
        )}
        <button onClick={() => { setToken(''); setProfile(null); }} style={{ padding: '8px 16px' }}>Logout</button>
      </div>
    );
  }

  const inputStyle = {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    padding: '8px',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <div style={{ position: 'relative', marginBottom: '10px', width: '100%' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, marginBottom: '0', paddingRight: '70px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#aaa',
              whiteSpace: 'nowrap',
            }}
          >
            {showPassword ? '🙈 Hide' : '👁 Show'}
          </button>
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '10px' }}>
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setIsLogin(!isLogin); setMessage(''); setUsername(''); setPassword(''); setShowPassword(false); }}
          style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;