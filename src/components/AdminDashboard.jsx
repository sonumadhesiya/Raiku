import React, { useState } from 'react';
import { 
  ShieldCheck, LogOut, CheckCircle, XCircle, PlusCircle, 
  Download, Search, Calendar, Edit3, Trash2, ArrowLeft, Eye, RefreshCw
} from 'lucide-react';
import EventCard from './EventCard';
import { exportRegionalCSV, downloadImage } from '../utils/downloadHelpers';

export default function AdminDashboard({ 
  events, 
  requests, 
  onApproveRequest, 
  onRejectRequest, 
  onCreateEvent, 
  onUpdateEvent, 
  onDeleteEvent,
  onNavigateHome
}) {
  // Admin Session State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('adminSession') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Tab & Filters
  const [showEnded, setShowEnded] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Event Form State
  const [createEventType, setCreateEventType] = useState('regional');
  const [createTitle, setCreateTitle] = useState('');
  const [createHostName, setCreateHostName] = useState('');
  const [createDiscord, setCreateDiscord] = useState('');
  const [createHostImage, setCreateHostImage] = useState('/raiku-mascot.png');
  const [createBannerImage, setCreateBannerImage] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [createTimeString, setCreateTimeString] = useState('18:00 IST');

  // Edit Event Modal State
  const [editingEvent, setEditingEvent] = useState(null);

  // Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      localStorage.setItem('adminSession', 'true');
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Please enter username and password.');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminSession');
      setIsAdminLoggedIn(false);
    }
  };

  // Helper for image upload conversions
  const handleImageConversion = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Create Event Handler
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createTitle || !createHostName || !createDate) {
      alert("Please complete required fields.");
      return;
    }

    if (!window.confirm("Are you sure you want to create this event?")) return;

    const newEvt = {
      id: `evt-${Date.now()}`,
      eventType: createEventType,
      title: createTitle,
      hostName: createHostName,
      discordUsername: createDiscord || '@raiku_official',
      hostImage: createHostImage || '/raiku-mascot.png',
      bannerImage: createBannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      description: createDescription,
      date: createDate,
      timeString: createTimeString || '18:00 IST',
      status: 'upcoming'
    };

    onCreateEvent(newEvt);
    setCreateTitle('');
    setCreateHostName('');
    setCreateDiscord('');
    setCreateDescription('');
    setCreateDate('');
    alert("Event created successfully!");
  };

  // Edit Event Handler
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!window.confirm("Are you sure you want to save changes to this event?")) return;

    onUpdateEvent(editingEvent);
    setEditingEvent(null);
    alert("Event updated successfully!");
  };

  // If Not Logged In -> Render Login Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '450px' }}>
        <button 
          onClick={onNavigateHome} 
          className="btn btn-secondary" 
          style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(192, 255, 56, 0.12)',
            border: '1px solid var(--neon-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            color: 'var(--neon-primary)'
          }}>
            <ShieldCheck size={32} />
          </div>

          <h2 className="neon-text" style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            Admin Access
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Enter credentials to manage host requests and events.
          </p>

          {loginError && (
            <div style={{
              background: 'rgba(224, 74, 74, 0.15)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.2rem',
              fontSize: '0.85rem'
            }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
              Login to Admin Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filter Events
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const activeEvents = events.filter(e => showEnded ? e.status === 'ended' : e.status !== 'ended');
  
  const filteredEvents = activeEvents.filter(e => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const titleMatch = (e.title || '').toLowerCase().includes(q);
      const hostMatch = (e.hostName || '').toLowerCase().includes(q);
      if (!titleMatch && !hostMatch) return false;
    }
    if (fromDate && e.date < fromDate) return false;
    if (toDate && e.date > toDate) return false;
    return true;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            onClick={onNavigateHome}
            className="btn btn-secondary"
            style={{ marginBottom: '0.75rem', padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}
          >
            <ArrowLeft size={14} /> Back to Live Site
          </button>
          <h1 className="neon-text" style={{ fontSize: '2.8rem', fontWeight: '800' }}>
            Admin Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => exportRegionalCSV(events)}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <Download size={15} /> Download Regional CSV ({events.filter(e => e.eventType === 'regional' || !e.eventType).length})
          </button>

          <button 
            className="btn btn-secondary"
            onClick={() => setShowEnded(!showEnded)}
            style={{
              fontSize: '0.85rem',
              padding: '0.5rem 1rem',
              borderColor: showEnded ? 'var(--neon-primary)' : 'rgba(255, 255, 255, 0.2)',
              background: showEnded ? 'rgba(192, 255, 56, 0.1)' : 'transparent'
            }}
          >
            <Eye size={15} /> {showEnded ? 'View Active Events' : `View Ended Events (${events.filter(e => e.status === 'ended').length})`}
          </button>

          <button 
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      {/* Main Admin Grid */}
      <div className="admin-grid">
        {/* Left Column: Pending Host Requests */}
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Pending Host Requests <span style={{ fontSize: '0.9rem', color: 'var(--neon-primary)', background: 'rgba(192,255,56,0.1)', padding: '2px 10px', borderRadius: '9999px' }}>{pendingRequests.length}</span>
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-secondary)' }}>
              <p>No pending host requests currently.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {pendingRequests.map((req) => (
                <div key={req.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.2rem' }}>{req.title}</h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Host: <strong style={{ color: 'var(--text-primary)' }}>{req.hostName}</strong> (Discord: {req.discordName})
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--neon-primary)', border: '1px solid var(--neon-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                      Pending
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {req.description}
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px' }}>
                    <img 
                      src={req.hostImage || '/raiku-mascot.png'} 
                      alt="Host Avatar" 
                      style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--neon-primary)' }}
                    />
                    <div style={{ flex: 1, fontSize: '0.8rem' }}>
                      <div><strong>Date:</strong> {req.date} at {req.timeString}</div>
                      <div style={{ color: 'var(--text-secondary)' }}>Applied At: {new Date(req.appliedOn).toLocaleString()}</div>
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => downloadImage(req.hostImage, `${req.hostName}_pfp.png`)}
                      style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      <Download size={12} /> PFP
                    </button>
                  </div>

                  {req.bannerImage && (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={req.bannerImage} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => downloadImage(req.bannerImage, `${req.title}_banner.png`)}
                        style={{
                          position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.8)',
                          color: 'var(--neon-primary)', border: '1px solid var(--neon-primary)', borderRadius: '4px',
                          padding: '3px 8px', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <Download size={12} /> Banner
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to approve this host request?')) {
                          onApproveRequest(req);
                        }
                      }}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      <CheckCircle size={15} /> Approve Request
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reject this host request?')) {
                          onRejectRequest(req.id);
                        }
                      }}
                      style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      <XCircle size={15} /> Reject Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Direct Create Event Form */}
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlusCircle size={22} style={{ color: 'var(--neon-primary)' }} /> Create New Event
          </h2>

          <div className="card" style={{ padding: '1.8rem' }}>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select 
                  className="form-control"
                  value={createEventType}
                  onChange={(e) => setCreateEventType(e.target.value)}
                >
                  <option value="regional">Regional Event (Indian Regional)</option>
                  <option value="global">Global Event</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Title *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="E.g., Raiku Web3 Meetup"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Host Name (Display Name) *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="E.g., Ayush Gautam"
                  value={createHostName}
                  onChange={(e) => setCreateHostName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discord Username</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="E.g., @ayush_gautam"
                  value={createDiscord}
                  onChange={(e) => setCreateDiscord(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Host Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageConversion(e, setCreateHostImage)}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows={3}
                  placeholder="Event description..."
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date (IST) *</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={createDate}
                    onChange={(e) => setCreateDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time (IST)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="18:00 IST"
                    value={createTimeString}
                    onChange={(e) => setCreateTimeString(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event Banner Graphic</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleImageConversion(e, setCreateBannerImage)}
                  className="form-control"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}>
                Create Event
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Active & Upcoming / Filtered Events Section */}
      <div style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>
            {showEnded ? 'Ended Events' : 'Active & Upcoming Events'} ({filteredEvents.length})
          </h2>

          {/* Search & Date Filter Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <input 
                type="text"
                className="form-control"
                placeholder="Search event/host..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>From:</span>
              <input 
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>To:</span>
              <input 
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', width: '130px' }}
              />
            </div>

            {(searchQuery || fromDate || toDate) && (
              <button 
                className="btn btn-secondary"
                onClick={() => { setSearchQuery(''); setFromDate(''); setToDate(''); }}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No events found matching the criteria.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredEvents.map(evt => (
              <EventCard 
                key={evt.id}
                event={evt}
                isAdminView={true}
                onEdit={(e) => setEditingEvent({ ...e })}
                onDelete={(id) => {
                  if (window.confirm("Are you sure you want to delete this event?")) {
                    onDeleteEvent(id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="modal-overlay" onClick={() => setEditingEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title neon-text">Edit Event Details</h2>
              <button className="modal-close-btn" onClick={() => setEditingEvent(null)}><XCircle size={20} /></button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Host Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={editingEvent.hostName}
                  onChange={(e) => setEditingEvent({ ...editingEvent, hostName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select 
                  className="form-control"
                  value={editingEvent.status || 'upcoming'}
                  onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="ended">Ended</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control"
                  rows={4}
                  value={editingEvent.description}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Date (IST)</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Time (IST)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={editingEvent.timeString}
                    onChange={(e) => setEditingEvent({ ...editingEvent, timeString: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingEvent(null)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Saving Changes...
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
