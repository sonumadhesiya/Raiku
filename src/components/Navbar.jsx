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

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {pendingCount > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={onOpenPendingModal}
              style={{
                fontSize: '0.85rem',
                padding: '0.45rem 0.9rem',
                borderColor: 'rgba(192, 255, 56, 0.4)',
                background: 'rgba(192, 255, 56, 0.08)'
              }}
            >
              <FileText size={16} /> View Pending Host Requests ({pendingCount})
            </button>
          )}

          <button 
            className="btn btn-primary"
            onClick={() => navigateTo('host-event')}
            style={{ fontSize: '0.85rem', padding: '0.45rem 1.1rem' }}
          >
            <PlusCircle size={16} /> Host an Event
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => navigateTo('admin')}
            style={{ fontSize: '0.85rem', padding: '0.45rem 0.9rem' }}
          >
            <ShieldAlert size={16} /> Admin
          </button>
        </div>
      </div>
    </header>
  );
}
