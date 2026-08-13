import React from 'react';
import { Download, Calendar, User, Image } from 'lucide-react';
import { downloadImage } from '../utils/downloadHelpers';

export default function EventCard({ event, isAdminView, onEdit, onDelete }) {
  const isEnded = event.status === 'ended';
  const isOngoing = event.status === 'ongoing';

  // Format date representation
  const formatDate = (dateStr, timeStr) => {
    try {
      if (!dateStr) return timeStr || 'TBD';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return `${dateStr} ${timeStr || ''}`;
      
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      const formattedDate = d.toLocaleDateString('en-US', options);
      return `${formattedDate} • ${timeStr || ''}`;
    } catch (e) {
      return `${dateStr} ${timeStr || ''}`;
    }
  };

  const bannerUrl = event.bannerImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
  const hostAvatarUrl = event.hostImage || "/raiku-mascot.png";
  const hostDisplayName = event.hostName || "Raiku Host";
  const discordHandle = event.discordUsername || event.discordName || "@raiku_user";

  return (
    <div className={`card ${isEnded ? 'ended' : ''}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 16:9 Banner Image Container */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.2rem', background: '#121211' }}>
        <img 
          src={bannerUrl} 
          alt={event.title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80";
          }}
        />

        {/* Status Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: 'rgba(11, 11, 10, 0.85)',
          border: isOngoing ? '1px solid var(--success)' : '1px solid var(--neon-primary)',
          borderRadius: '9999px',
          padding: '4px 12px',
          fontSize: '0.75rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(8px)',
          color: isOngoing ? 'var(--success)' : 'var(--neon-primary)'
        }}>
          {isOngoing && <span className="pulse-dot" />}
          {isOngoing ? 'Ongoing' : (isEnded ? 'Ended' : 'Upcoming')}
        </div>

        {/* Banner Download Overlay Button */}
        <button
          onClick={() => downloadImage(bannerUrl, `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}-banner.png`)}
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(11, 11, 10, 0.8)',
            border: '1px solid var(--neon-primary)',
            color: 'var(--neon-primary)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s'
          }}
          title="Download Banner Graphic"
        >
          <Download size={14} /> Download Banner
        </button>
      </div>

      {/* Date & Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-primary)', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
        <Calendar size={15} />
        <span>{formatDate(event.date, event.timeString)}</span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '0.6rem', lineHeight: '1.3' }}>
        {event.title}
      </h3>

      {/* Description */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.2rem', flex: 1, whiteSpace: 'pre-wrap' }}>
        {event.description}
      </p>

      {/* Host Details & Actions Footer */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={hostAvatarUrl} 
              alt={hostDisplayName}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid var(--neon-primary)',
                background: '#121211'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/raiku-mascot.png";
              }}
            />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                Host: {hostDisplayName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                (Discord: {discordHandle})
              </div>
            </div>
          </div>

          <button
            onClick={() => downloadImage(hostAvatarUrl, `${hostDisplayName.replace(/[^a-zA-Z0-9]/g, '_')}-avatar.png`)}
            className="btn btn-secondary"
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '6px'
            }}
            title="Download Host Photo"
          >
            <Download size={13} /> PFP
          </button>
        </div>

        {isAdminView && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => onEdit(event)}
              style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger" 
              onClick={() => onDelete(event.id)}
              style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
