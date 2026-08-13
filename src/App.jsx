import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EventCardComp from './components/EventCard';
import HostEventForm from './components/HostEventForm';
import PendingRequestsModal from './components/PendingRequestsModal';
import AdminDashboard from './components/AdminDashboard';
import { 
  getStoredEvents, setStoredEvents, 
  getStoredRequests, setStoredRequests 
} from './data/initialData';
import { PlusCircle, Sparkles, Calendar, Globe, MapPin, Heart } from 'lucide-react';

export default function App() {
  // State management
  const [events, setEvents] = useState(getStoredEvents);
  const [requests, setRequests] = useState(getStoredRequests);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'host-event' | 'admin'
  const [editRequestId, setEditRequestId] = useState(null);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    setStoredEvents(events);
  }, [events]);

  useEffect(() => {
    setStoredRequests(requests);
  }, [requests]);

  // Navigate helper
  const navigateTo = (view, editId = null) => {
    setCurrentView(view);
    setEditRequestId(editId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Host Request Handlers
  const handleAddOrUpdateRequest = (requestData) => {
    setRequests((prev) => {
      const exists = prev.some((r) => r.id === requestData.id);
      if (exists) {
        return prev.map((r) => (r.id === requestData.id ? requestData : r));
      }
      return [requestData, ...prev];
    });
  };

  const handleDeleteRequest = (reqId) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  // Admin Request Handlers
  const handleApproveRequest = (requestItem) => {
    // Convert request into active regional event
    const newEvent = {
      id: `evt-${Date.now()}`,
      eventType: 'regional',
      title: requestItem.title,
      description: requestItem.description,
      hostName: requestItem.hostName,
      discordUsername: requestItem.discordName,
      hostImage: requestItem.hostImage || '/raiku-mascot.png',
      bannerImage: requestItem.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      date: requestItem.date,
      timeString: requestItem.timeString,
      status: 'upcoming'
    };

    setEvents((prev) => [newEvent, ...prev]);
    setRequests((prev) => prev.filter((r) => r.id !== requestItem.id));
  };

  const handleRejectRequest = (reqId) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  // Admin Event Handlers
  const handleCreateEvent = (newEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleDeleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  // Pending count for navbar
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  // Global and Regional lists
  const globalEvents = events.filter((e) => e.eventType === 'global');
  const regionalEvents = events.filter((e) => e.eventType === 'regional' || !e.eventType);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
      {/* Navigation Header */}
      <Navbar 
        pendingCount={pendingCount}
        onOpenPendingModal={() => setIsPendingModalOpen(true)}
        currentView={currentView}
        navigateTo={navigateTo}
      />

      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <div>
            {/* Hero Banner Section */}
            <section style={{ 
              padding: '4rem 0 3.5rem', 
              textAlign: 'center', 
              position: 'relative', 
              overflow: 'hidden',
              background: 'radial-gradient(circle at 50% 20%, rgba(192, 255, 56, 0.08) 0%, rgba(11, 11, 10, 0) 70%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                {/* Brand Mascot Highlight */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
                  <img 
                    src="/raiku-mascot.png" 
                    alt="Raiku Mascot" 
                    style={{ 
                      height: '75px', 
                      filter: 'drop-shadow(0 0 15px rgba(192, 255, 56, 0.4))',
                      animation: 'pulse 3s infinite ease-in-out'
                    }} 
                  />
                  <img 
                    src="/raiku-text-outlined.png" 
                    alt="RAIKU" 
                    style={{ height: '38px', filter: 'drop-shadow(0 0 10px rgba(192, 255, 56, 0.3))' }} 
                  />
                </div>

                <h1 className="neon-text main-title">
                  Stay Updated with Raiku Events
                </h1>
                <p className="main-desc">
                  Explore global and regional events, and submit applications to host your own.
                </p>

                <div className="hero-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  {pendingCount > 0 && (
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setIsPendingModalOpen(true)}
                      style={{
                        padding: '0.75rem 1.6rem',
                        borderColor: 'rgba(192, 255, 56, 0.4)',
                        background: 'rgba(192, 255, 56, 0.08)'
                      }}
                    >
                      <Sparkles size={18} /> View Pending Host Requests ({pendingCount})
                    </button>
                  )}

                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigateTo('host-event')}
                    style={{ padding: '0.75rem 2rem', fontSize: '1.05rem' }}
                  >
                    <PlusCircle size={18} /> Host an Event
                  </button>
                </div>
              </div>
            </section>

            {/* Events Content Container */}
            <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
              {/* Global Events Section */}
              <section style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.8rem' }}>
                  <Globe size={26} style={{ color: 'var(--neon-primary)' }} />
                  <h2 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                    Global Events
                  </h2>
                </div>

                {globalEvents.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No upcoming global events.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {globalEvents.map((evt) => (
                      <EventCardComp key={evt.id} event={evt} />
                    ))}
                  </div>
                )}
              </section>

              {/* Indian Regional Events Section */}
              <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MapPin size={26} style={{ color: 'var(--neon-primary)' }} />
                    <h2 style={{ fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                      Indian Regional Events
                    </h2>
                  </div>

                  <button 
                    className="btn btn-primary"
                    onClick={() => navigateTo('host-event')}
                    style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
                  >
                    <PlusCircle size={16} /> Host an Event
                  </button>
                </div>

                {regionalEvents.length === 0 ? (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No upcoming regional events.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {regionalEvents.map((evt) => (
                      <EventCardComp key={evt.id} event={evt} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        )}

        {/* Host Event Form Route */}
        {currentView === 'host-event' && (
          <HostEventForm 
            editRequestId={editRequestId}
            requests={requests}
            onSubmitRequest={handleAddOrUpdateRequest}
            onCancel={() => navigateTo('home')}
          />
        )}

        {/* Admin Dashboard Route */}
        {currentView === 'admin' && (
          <AdminDashboard 
            events={events}
            requests={requests}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onCreateEvent={handleCreateEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Pending Requests Modal */}
      {isPendingModalOpen && (
        <PendingRequestsModal 
          requests={requests}
          onClose={() => setIsPendingModalOpen(false)}
          onEditRequest={(id) => navigateTo('host-event', id)}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: '2.5rem 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'var(--bg-color-secondary)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/raiku-icon.png" alt="Raiku Icon" style={{ height: '24px' }} />
            <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>RAIKU EVENT MANAGER</span>
          </div>
          <p>© 2026 Raiku. All rights reserved. Premium Event Management Platform.</p>
        </div>
      </footer>
    </div>
  );
}
