import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Share } from 'lucide-react';

export default function Header() {
  const { signOut, user } = useAuth();
  const [copied, setCopied] = useState(false);
  
  function handleShare() {
    if (user) {
      // Create a temporary input to copy the text to support more browsers
      const url = `${window.location.host}/share/${user.id}`;
      const fullUrl = window.location.protocol + '//' + url;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Failed to copy', err);
        }
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <header className="global-header">
      <div className="brand-group">
        <div className="brand-logo" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div className="brand-titles">
          <h1>Wishlist Keeper</h1>
          <p className="subtitle">Track what you want, calculate your budget, and prioritize essentials.</p>
        </div>
      </div>
      {user && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleShare} className="primary-btn" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Share size={16} /> {copied ? 'Copied Link!' : 'Share Profile'}
          </button>
          <button onClick={signOut} className="ghost-btn" style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: 'var(--panel)', color: 'var(--text)' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
