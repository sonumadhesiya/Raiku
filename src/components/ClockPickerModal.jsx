import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';

export default function ClockPickerModal({ initialTime, onSelect, onClose }) {
  // Parse initial time string e.g. "18:00 IST" or "06:30 PM IST" or "18:00"
  const parseTime = (str) => {
    if (!str) return { hour: 12, minute: 0, ampm: 'PM' };
    const clean = str.replace(' IST', '').trim();
    const parts = clean.split(':');
    if (parts.length >= 2) {
      let h = parseInt(parts[0], 10);
      let m = parseInt(parts[1], 10) || 0;
      let ampm = 'AM';
      if (clean.includes('PM') || clean.includes('pm')) {
        ampm = 'PM';
      } else if (clean.includes('AM') || clean.includes('am')) {
        ampm = 'AM';
      } else {
        if (h >= 12) {
          ampm = 'PM';
          if (h > 12) h -= 12;
        } else if (h === 0) {
          h = 12;
        }
      }
      return { hour: h > 12 ? h - 12 : (h === 0 ? 12 : h), minute: m, ampm };
    }
    return { hour: 12, minute: 0, ampm: 'PM' };
  };

  const initial = parseTime(initialTime);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [ampm, setAmpm] = useState(initial.ampm);
  const [mode, setMode] = useState('hours'); // 'hours' | 'minutes'

  const handleHourClick = (h) => {
    setHour(h);
    setMode('minutes');
  };

  const handleMinuteClick = (m) => {
    setMinute(m);
  };

  const handleConfirm = () => {
    let h24 = hour;
    if (ampm === 'PM' && hour < 12) h24 += 12;
    if (ampm === 'AM' && hour === 12) h24 = 0;
    
    const formatted24 = `${h24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} IST`;
    onSelect(formatted24);
  };

  // Degrees for clock hands
  const hourDeg = (hour % 12) * 30 + (minute / 60) * 30;
  const minuteDeg = minute * 6;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="clock-picker-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#121211',
          border: '1px solid rgba(192, 255, 56, 0.3)',
          borderRadius: '20px',
          width: '320px',
          padding: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.9), 0 0 25px rgba(192,255,56,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-primary)', fontWeight: '600', fontSize: '1rem' }}>
            <Clock size={18} /> Select Event Time (IST)
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Display Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(192, 255, 56, 0.2)',
          width: '100%'
        }}>
          <span 
            onClick={() => setMode('hours')}
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: mode === 'hours' ? 'var(--neon-primary)' : 'var(--text-primary)',
              borderBottom: mode === 'hours' ? '2px solid var(--neon-primary)' : '2px solid transparent'
            }}
          >
            {hour.toString().padStart(2, '0')}
          </span>
          <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-secondary)' }}>:</span>
          <span 
            onClick={() => setMode('minutes')}
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              cursor: 'pointer',
              color: mode === 'minutes' ? 'var(--neon-primary)' : 'var(--text-primary)',
              borderBottom: mode === 'minutes' ? '2px solid var(--neon-primary)' : '2px solid transparent'
            }}
          >
            {minute.toString().padStart(2, '0')}
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setAmpm('AM')}
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                border: 'none',
                background: ampm === 'AM' ? 'var(--neon-primary)' : 'rgba(255,255,255,0.08)',
                color: ampm === 'AM' ? '#000' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              AM
            </button>
            <button
              type="button"
              onClick={() => setAmpm('PM')}
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                border: 'none',
                background: ampm === 'PM' ? 'var(--neon-primary)' : 'rgba(255,255,255,0.08)',
                color: ampm === 'PM' ? '#000' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              PM
            </button>
          </div>
        </div>

        {/* Analog Clock Face */}
        <div style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(192, 255, 56, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Clock Dial Center */}
          <div style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--neon-primary)',
            zIndex: 10
          }} />

          {/* Clock Hand */}
          <div style={{
            position: 'absolute',
            width: '2px',
            height: mode === 'hours' ? '55px' : '70px',
            background: 'var(--neon-primary)',
            bottom: '50%',
            left: 'calc(50% - 1px)',
            transformOrigin: 'bottom center',
            transform: `rotate(${mode === 'hours' ? hourDeg : minuteDeg}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 8px rgba(192,255,56,0.6)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '-5px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'var(--neon-primary)'
            }} />
          </div>

          {/* Clock Numbers */}
          {mode === 'hours' ? (
            [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const r = 72; // radius
              const x = Math.round(r * Math.cos(angle));
              const y = Math.round(r * Math.sin(angle));
              const isSelected = hour === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleHourClick(n)}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 14px)`,
                    top: `calc(50% + ${y}px - 14px)`,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isSelected ? 'var(--neon-primary)' : 'transparent',
                    color: isSelected ? '#000' : 'var(--text-primary)',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  {n}
                </button>
              );
            })
          ) : (
            [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180);
              const r = 72;
              const x = Math.round(r * Math.cos(angle));
              const y = Math.round(r * Math.sin(angle));
              const isSelected = Math.abs(minute - m) < 3;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMinuteClick(m)}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px - 14px)`,
                    top: `calc(50% + ${y}px - 14px)`,
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isSelected ? 'var(--neon-primary)' : 'transparent',
                    color: isSelected ? '#000' : 'var(--text-primary)',
                    fontWeight: isSelected ? '700' : '500',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s'
                  }}
                >
                  {m.toString().padStart(2, '0')}
                </button>
              );
            })
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="button" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={onClose}>
            Cancel
          </button>
          {mode === 'hours' ? (
            <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => setMode('minutes')}>
              Next
            </button>
          ) : (
            <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={handleConfirm}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
