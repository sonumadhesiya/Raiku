import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'server', 'db.json');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read DB
const readDB = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultData = { events: [], requests: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB:', err);
    return { events: [], requests: [] };
  }
};

// Helper to write DB
const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
};

// GET /api/events - Get all active/approved events
app.get('/api/events', (req, res) => {
  const db = readDB();
  res.json(db.events || []);
});

// GET /api/requests - Get all pending host requests
app.get('/api/requests', (req, res) => {
  const db = readDB();
  res.json(db.requests || []);
});

// POST /api/host-request - Submit a new event (AUTOMATICALLY PUBLISHED & SHARED FOR ALL USERS/BROWSERS!)
app.post('/api/host-request', (req, res) => {
  const db = readDB();
  const data = req.body;
  
  const eventId = data.id || `evt-${Date.now()}`;
  const newEvent = {
    id: eventId,
    eventType: 'active',
    title: data.title,
    description: data.description,
    hostName: data.hostName,
    discordUsername: data.discordName || data.discordUsername || '@user',
    hostImage: data.hostImage || '/raiku-mascot.png',
    bannerImage: data.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    date: data.date,
    timeString: data.timeString || '18:00 IST',
    status: 'upcoming'
  };

  const newRequest = {
    ...newEvent,
    discordName: newEvent.discordUsername,
    appliedOn: data.appliedOn || new Date().toISOString()
  };

  // Add/update in events (Active list for everyone!)
  const existingEvtIdx = db.events.findIndex(e => e.id === eventId);
  if (existingEvtIdx >= 0) {
    db.events[existingEvtIdx] = newEvent;
  } else {
    db.events.unshift(newEvent);
  }

  // Add/update in requests
  const existingReqIdx = db.requests.findIndex(r => r.id === eventId);
  if (existingReqIdx >= 0) {
    db.requests[existingReqIdx] = newRequest;
  } else {
    db.requests.unshift(newRequest);
  }

  writeDB(db);
  console.log(`[API] New Event PUBLISHED globally: "${newEvent.title}" by ${newEvent.hostName}. Total events: ${db.events.length}`);
  res.json({ success: true, event: newEvent, request: newRequest });
});

// PUT /api/host-request/:id - Update pending request
app.put('/api/host-request/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const existingIdx = db.requests.findIndex(r => r.id === id);
  if (existingIdx >= 0) {
    db.requests[existingIdx] = { ...db.requests[existingIdx], ...req.body, status: 'pending' };
    writeDB(db);
    res.json({ success: true, request: db.requests[existingIdx] });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// DELETE /api/host-request/:id - Delete pending request
app.delete('/api/host-request/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.requests = db.requests.filter(r => r.id !== id);
  db.events = db.events.filter(e => e.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// POST /api/admin/requests/:id/approve - Approve pending request (MOVES TO ACTIVE EVENTS!)
app.post('/api/admin/requests/:id/approve', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const reqIdx = db.requests.findIndex(r => r.id === id);

  let targetReq = null;
  if (reqIdx >= 0) {
    targetReq = db.requests[reqIdx];
    db.requests.splice(reqIdx, 1);
  } else if (req.body && req.body.title) {
    targetReq = req.body;
  }

  if (!targetReq) {
    return res.status(404).json({ error: 'Host request not found' });
  }

  // Create active event
  const newEvent = {
    id: targetReq.id || `evt-${Date.now()}`,
    eventType: 'active',
    title: targetReq.title,
    description: targetReq.description,
    hostName: targetReq.hostName,
    discordUsername: targetReq.discordName || targetReq.discordUsername || '@user',
    hostImage: targetReq.hostImage || '/raiku-mascot.png',
    bannerImage: targetReq.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    date: targetReq.date,
    timeString: targetReq.timeString || '18:00 IST',
    status: 'upcoming'
  };

  // Add to events
  const existingEvtIdx = db.events.findIndex(e => e.id === newEvent.id);
  if (existingEvtIdx >= 0) {
    db.events[existingEvtIdx] = newEvent;
  } else {
    db.events.unshift(newEvent);
  }

  writeDB(db);
  console.log(`[API] Admin APPROVED event: "${newEvent.title}". Now live on Active Events!`);
  res.json({ success: true, event: newEvent });
});

// POST /api/admin/requests/:id/reject - Reject pending request
app.post('/api/admin/requests/:id/reject', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.requests = db.requests.filter(r => r.id !== id);
  writeDB(db);
  res.json({ success: true });
});

// POST /api/admin/events - Admin directly creates an event
app.post('/api/admin/events', (req, res) => {
  const db = readDB();
  const eventData = req.body;
  db.events.unshift(eventData);
  writeDB(db);
  res.json({ success: true, event: eventData });
});

// PUT /api/admin/events/:id - Admin updates event
app.put('/api/admin/events/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  const idx = db.events.findIndex(e => e.id === id);
  if (idx >= 0) {
    db.events[idx] = { ...db.events[idx], ...req.body };
    writeDB(db);
    res.json({ success: true, event: db.events[idx] });
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

// DELETE /api/admin/events/:id - Admin deletes event
app.delete('/api/admin/events/:id', (req, res) => {
  const db = readDB();
  const id = req.params.id;
  db.events = db.events.filter(e => e.id !== id);
  writeDB(db);
  res.json({ success: true });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`[Raiku API Server] Running on http://localhost:${PORT}`);
});
