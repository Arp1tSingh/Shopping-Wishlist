import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { error } = await signUp({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <section className="add-panel" style={{ padding: '32px' }}>
        <div className="panel-header" style={{ justifyContent: 'center', marginBottom: '24px' }}>
          <h2>Create Account</h2>
        </div>
        
        {error && <div style={{ color: 'var(--coral)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-actions" style={{ justifyContent: 'center', marginTop: '24px', borderTop: 'none', paddingTop: 0 }}>
            <button disabled={loading} type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Sign Up
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--text-muted)' }}>— or —</div>
        
        <button type="button" onClick={signInWithGoogle} className="ghost-btn" style={{ width: '100%', justifyContent: 'center' }}>
          Sign Up with Google
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <p>Already have an account? <Link to="/login" style={{ color: 'var(--marigold)' }}>Sign In</Link></p>
        </div>
      </section>
    </div>
  );
}
