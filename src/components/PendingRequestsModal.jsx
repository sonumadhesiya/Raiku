import React from 'react';
import { X, Calendar, Clock, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export default function PendingRequestsModal({ requests, onClose, onEditRequest, onDeleteRequest }) {
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h2 className="modal-title neon-text" style={{ fontSize: '1.4rem', fontWeight: '700' }}>
            Pending Host Requests ({pendingRequests.length})
          </h2>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body">
          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>No pending host requests currently.</p>
              <p style={{ fontSize: '0.85rem' }}>Click "Host an Event" on the home page to submit a new request.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pendingRequests.map((req) => (
                <div 
                  key={req.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(192, 255, 56, 0.25)',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {req.title}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Host: <strong style={{ color: 'var(--text-primary)' }}>{req.hostName}</strong> (Discord: {req.discordName})
                      </div>
                    </div>

                    <span style={{
                      background: 'rgba(192, 255, 56, 0.1)',
                      border: '1px solid rgba(192, 255, 56, 0.4)',
                      color: 'var(--neon-primary)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      padding: '3px 10px',
                      borderRadius: '9999px'
                    }}>
                      Pending Approval
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {req.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--neon-primary)' }}>
                    <span><strong>Requested Date:</strong> {req.date}</span>
                    <span><strong>Requested Time:</strong> {req.timeString}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>Applied On: {new Date(req.appliedOn).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => { onClose(); onEditRequest(req.id); }}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', borderRadius: '6px' }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to delete this event request?")) {
                            onDeleteRequest(req.id);
                          }
                        }}
                        style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem', borderRadius: '6px' }}
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
