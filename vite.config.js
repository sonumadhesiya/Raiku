import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve(import.meta.dirname, 'server/db.json');

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const defaultData = { events: [], requests: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return { events: [], requests: [] };
  }
}

function writeDB(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Embedded API plugin so Vite itself handles real-time JSON DB persistence!
const apiPlugin = () => ({
  name: 'raiku-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith('/api/')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          return res.end();
        }

        if (req.url === '/api/events' && req.method === 'GET') {
          const db = readDB();
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(db.events || []));
        }

        if (req.url === '/api/requests' && req.method === 'GET') {
          const db = readDB();
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(db.requests || []));
        }

        if ((req.url === '/api/host-request' || req.url === '/api/admin/events') && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const db = readDB();
              const eventId = data.id || `evt-${Date.now()}`;
              
              const newEvent = {
                id: eventId,
                eventType: 'active',
                title: data.title || 'Untitled Event',
                description: data.description || '',
                hostName: data.hostName || 'Anonymous',
                discordUsername: data.discordName || data.discordUsername || '@user',
                hostImage: data.hostImage || '/raiku-mascot.png',
                bannerImage: data.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
                date: data.date || new Date().toISOString().slice(0,10),
                timeString: data.timeString || '18:00 IST',
                status: 'upcoming'
              };

              const newRequest = {
                ...newEvent,
                discordName: newEvent.discordUsername,
                appliedOn: data.appliedOn || new Date().toISOString()
              };

              // Save to db.events (Active list for everyone!)
              const existingIdx = db.events.findIndex(e => e.id === eventId);
              if (existingIdx >= 0) {
                db.events[existingIdx] = newEvent;
              } else {
                db.events.unshift(newEvent);
              }

              // Save to db.requests
              const existingReqIdx = db.requests.findIndex(r => r.id === eventId);
              if (existingReqIdx >= 0) {
                db.requests[existingReqIdx] = newRequest;
              } else {
                db.requests.unshift(newRequest);
              }

              writeDB(db);
              console.log(`[Vite API] Event PUBLISHED globally: "${newEvent.title}". Total events: ${db.events.length}`);
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ success: true, event: newEvent, request: newRequest }));
            } catch (err) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.url.startsWith('/api/host-request/') && req.method === 'DELETE') {
          const id = req.url.replace('/api/host-request/', '');
          const db = readDB();
          db.requests = db.requests.filter(r => r.id !== id);
          db.events = db.events.filter(e => e.id !== id);
          writeDB(db);
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: true }));
        }

        if (req.url.startsWith('/api/admin/events/') && req.method === 'DELETE') {
          const id = req.url.replace('/api/admin/events/', '');
          const db = readDB();
          db.events = db.events.filter(e => e.id !== id);
          writeDB(db);
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ success: true }));
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 5173,
    host: '0.0.0.0'
  }
});
