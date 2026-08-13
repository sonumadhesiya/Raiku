import React, { useState, useEffect } from 'react';
import { Clock, Upload, ArrowLeft, CheckCircle2, Image as ImageIcon, User, Sparkles } from 'lucide-react';
import ClockPickerModal from './ClockPickerModal';
import confetti from 'canvas-confetti';

export default function HostEventForm({ editRequestId, requests, onSubmitRequest, onCancel }) {
  const isEditing = Boolean(editRequestId);
  const existingReq = isEditing ? requests.find(r => r.id === editRequestId) : null;

  const [hostName, setHostName] = useState(existingReq?.hostName || '');
  const [discordName, setDiscordName] = useState(existingReq?.discordName || '');
  const [title, setTitle] = useState(existingReq?.title || '');
  const [description, setDescription] = useState(existingReq?.description || '');
  const [date, setDate] = useState(existingReq?.date || '');
  const [timeString, setTimeString] = useState(existingReq?.timeString || '18:00 IST');

  // Image states (data URL or relative path)
  const [hostImage, setHostImage] = useState(existingReq?.hostImage || '/raiku-mascot.png');
  const [bannerImage, setBannerImage] = useState(existingReq?.bannerImage || '');

  // UI state
  const [showClockModal, setShowClockModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle image upload conversions to Data URL
  const handleFileUpload = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please choose a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hostName.trim()) {
      setErrorMessage('Please provide your Host Display Name.');
      return;
    }
    if (!discordName.trim()) {
      setErrorMessage('Please provide your Discord Username.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please provide the Event Title.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please provide a short description for the event.');
      return;
    }
    if (!date) {
      setErrorMessage('Please select the Event Date.');
      return;
    }

    const confirmMsg = isEditing 
      ? 'Are you sure you want to save changes to this event request?' 
      : 'Are you sure you want to submit this event request?';

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const payload = {
        id: isEditing ? editRequestId : `req-${Date.now()}`,
        hostName: hostName.trim(),
        discordName: discordName.trim(),
        title: title.trim(),
        description: description.trim(),
        date,
        timeString: timeString || '18:00 IST',
        hostImage: hostImage || '/raiku-mascot.png',
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        appliedOn: existingReq?.appliedOn || new Date().toISOString(),
        status: 'upcoming'
      };

      onSubmitRequest(payload);
      setIsSubmitting(false);

      // Trigger celebrate confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C0FF38', '#e5ff80', '#86b817', '#ffffff']
      });

      setSuccessMessage(
        isEditing 
          ? 'Your event has been successfully updated.' 
          : 'Your event has been successfully published to Active & Upcoming Events!'
      );

      setTimeout(() => {
        onCancel();
      }, 1500);
    }, 400);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '750px' }}>
      <button 
        onClick={onCancel}
        className="btn btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem' }}>
          <h1 className="neon-text" style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            {isEditing ? 'Edit Host Application' : 'Host a Regional Event'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {isEditing 
              ? 'Update the details of your pending host request below.' 
              : 'Fill out the details below to request hosting an event.'}
          </p>
        </div>

        {errorMessage && (
          <div style={{
            background: 'rgba(224, 74, 74, 0.15)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: 'rgba(74, 224, 125, 0.15)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={18} /> {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Host Display Name */}
          <div className="form-group">
            <label className="form-label">Host Display Name (Your Name) *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="E.g., Ayush Gautam"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              required
            />
          </div>

          {/* Discord Username */}
          <div className="form-group">
            <label className="form-label">Discord Username (Not numeric User ID) *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="E.g., @ayush_gautam (or ayushgautam)"
              value={discordName}
              onChange={(e) => setDiscordName(e.target.value)}
              required
            />
          </div>

          {/* Host Profile Photo (PFP) Upload */}
          <div className="form-group">
            <label className="form-label">Host Profile Photo (PFP)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <img 
                src={hostImage || "/raiku-mascot.png"} 
                alt="Host Preview"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--neon-primary)',
                  background: '#121211'
                }}
              />
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, setHostImage)}
                  style={{ display: 'none' }}
                  id="hostPfpInput"
                />
                <label 
                  htmlFor="hostPfpInput" 
                  className="btn btn-secondary"
                  style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Upload size={15} /> Upload Host Photo
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.75rem' }}>
                  {hostImage ? 'Custom image loaded' : 'Default mascot used'}
                </span>
              </div>
            </div>
          </div>

          {/* Event Title */}
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input 
              type="text" 
              className="form-control"
              placeholder="E.g., Raiku Bengaluru Web3 Meetup"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Short Description */}
          <div className="form-group">
            <label className="form-label">Short Description *</label>
            <textarea 
              className="form-control"
              rows={4}
              placeholder="Provide event overview, schedule highlights, venue details, or target audience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Event Banner Graphic (16:9) */}
          <div className="form-group">
            <label className="form-label">Event Banner Graphic (16:9)</label>
            {bannerImage && (
              <div style={{ marginBottom: '0.75rem', borderRadius: '8px', overflow: 'hidden', maxHeight: '180px', border: '1px solid rgba(192, 255, 56, 0.3)' }}>
                <img src={bannerImage} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileUpload(e, setBannerImage)}
              style={{ display: 'none' }}
              id="bannerImageInput"
            />
            <label 
              htmlFor="bannerImageInput" 
              className="btn btn-secondary"
              style={{ cursor: 'pointer', width: '100%', justifyContent: 'center', padding: '0.65rem' }}
            >
              <Upload size={16} /> {bannerImage ? 'Change Banner Graphic' : 'Upload Banner Graphic (16:9)'}
            </label>
          </div>

          {/* Date & Time Row */}
          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Event Date (IST) *</label>
              <input 
                type="date" 
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Time (IST) *</label>
              <button
                type="button"
                className="form-control"
                onClick={() => setShowClockModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{timeString || 'Select Time'}</span>
                <Clock size={16} style={{ color: 'var(--neon-primary)' }} />
              </button>
            </div>
          </div>

          {/* Submit / Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              style={{ flex: 1 }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 2 }}
              disabled={isSubmitting}
            >
              <Sparkles size={16} /> {isSubmitting ? (isEditing ? 'Updating...' : 'Submitting...') : (isEditing ? 'Save Changes' : 'Submit Request')}
            </button>
          </div>
        </form>
      </div>

      {/* Custom Clock Picker Modal */}
      {showClockModal && (
        <ClockPickerModal 
          initialTime={timeString}
          onSelect={(selected) => {
            setTimeString(selected);
            setShowClockModal(false);
          }}
          onClose={() => setShowClockModal(false)}
        />
      )}
    </div>
  );
}
