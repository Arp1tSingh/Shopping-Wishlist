import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage('Check your inbox for further instructions.');
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
          <h2>Reset Password</h2>
        </div>
        
        {error && <div style={{ color: 'var(--coral)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: 'var(--sage)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-actions" style={{ justifyContent: 'center', marginTop: '24px', borderTop: 'none', paddingTop: 0 }}>
            <button disabled={loading} type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Reset Password
            </button>
          </div>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <p><Link to="/login" style={{ color: 'var(--marigold)' }}>Back to Sign In</Link></p>
        </div>
      </section>
    </div>
  );
}
