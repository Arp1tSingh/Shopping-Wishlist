import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      const { error } = await updatePassword(password);
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
          <h2>Update Password</h2>
        </div>
        
        {error && <div style={{ color: 'var(--coral)', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="form-actions" style={{ justifyContent: 'center', marginTop: '24px', borderTop: 'none', paddingTop: 0 }}>
            <button disabled={loading} type="submit" className="primary-btn" style={{ width: '100%', justifyContent: 'center' }}>
              Update Password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
