import React from 'react';
import { ShieldAlert, PlusCircle, FileText } from 'lucide-react';

export default function Navbar({ pendingCount, onOpenPendingModal, currentView, navigateTo }) {
  return (
    <header className="nav">
      <div className="container nav-container">
        <a 
          href="/" 
          className="logo" 
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
        >
          <img src="/raiku-icon.png" alt="Raiku Icon" className="logo-img" style={{ height: '36px' }} />
          <img src="/raiku-text-outlined.png" alt="RAIKU" className="logo-text-img" style={{ height: '24px' }} />
          <span 
            className="logo-badge"
            style={{ 
              fontSize: '0.65rem', 
              background: 'var(--neon-gradient)', 
              color: '#000', 
              padding: '2px 8px', 
              borderRadius: '9999px', 
              fontWeight: '700',
              marginLeft: '4px',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            EVENTS
          </span>
        </a>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {pendingCount > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={onOpenPendingModal}
              style={{
                fontSize: '0.85rem',
                padding: '0.45rem 0.85rem',
                borderColor: 'rgba(192, 255, 56, 0.4)',
                background: 'rgba(192, 255, 56, 0.08)'
              }}
            >
              <FileText size={16} /> <span>Pending ({pendingCount})</span>
            </button>
          )}

          <button 
            className="btn btn-primary"
            onClick={() => navigateTo('host-event')}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
          >
            <PlusCircle size={16} /> <span>Host an Event</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => navigateTo('admin')}
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
          >
            <ShieldAlert size={16} /> <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
