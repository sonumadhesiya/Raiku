// Pre-populated initial Raiku events
export const INITIAL_EVENTS = [
  {
    id: "evt-g1",
    eventType: "global",
    title: "Raiku Global Tech Summit 2026",
    description: "Join global Web3 developers, innovators, and creators for the flagship Raiku Tech Summit featuring keynote presentations, live AI & blockchain workshops, and community showcases.",
    hostName: "Ayush Gautam",
    discordUsername: "@ayush_gautam",
    hostImage: "/raiku-mascot.png",
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    date: "2026-08-20",
    timeString: "18:00 IST",
    status: "ongoing"
  },
  {
    id: "evt-g2",
    eventType: "global",
    title: "Raiku Hackathon: Next-Gen Infra",
    description: "A 48-hour online hackathon with over $50,000 in prizes for builders scaling high-performance decentralized systems on Raiku protocol.",
    hostName: "Raiku Core Team",
    discordUsername: "@raiku_official",
    hostImage: "/raiku-icon.png",
    bannerImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    date: "2026-09-02",
    timeString: "20:00 IST",
    status: "upcoming"
  },
  {
    id: "evt-r1",
    eventType: "regional",
    title: "Raiku Bengaluru Meetup & Dev Lounge",
    description: "Exclusive in-person community gathering in Indiranagar, Bengaluru. Enjoy tech talks, network with local founders, and claim exclusive Raiku swag!",
    hostName: "Rohan Sharma",
    discordUsername: "@rohans_dev",
    hostImage: "/raiku-mascot.png",
    bannerImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    date: "2026-08-25",
    timeString: "16:00 IST",
    status: "upcoming"
  },
  {
    id: "evt-r2",
    eventType: "regional",
    title: "Raiku Delhi Web3 Builders Assembly",
    description: "Regional summit for developers, designers, and community leads based in Delhi NCR to share insights on zero-knowledge and decentralized compute.",
    hostName: "Priya Patel",
    discordUsername: "@priya_web3",
    hostImage: "/raiku-icon.png",
    bannerImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    date: "2026-09-10",
    timeString: "17:30 IST",
    status: "upcoming"
  }
];

export const INITIAL_REQUESTS = [
  {
    id: "req-101",
    hostName: "Karan Verma",
    discordName: "@karan_v",
    hostImage: "/raiku-mascot.png",
    title: "Raiku Mumbai Campus Hacker Workshop",
    description: "Hands-on workshop for college students introducing Raiku SDKs, smart contracts, and high-speed RPC nodes.",
    bannerImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    date: "2026-09-18",
    timeString: "15:00 IST",
    appliedOn: "2026-08-12T14:20:00+05:30",
    status: "pending"
  }
];

// Helper to get events
export const getStoredEvents = () => {
  try {
    const data = localStorage.getItem("raiku_events");
    if (!data) {
      localStorage.setItem("raiku_events", JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading events from localStorage", e);
    return INITIAL_EVENTS;
  }
};

// Helper to save events
export const setStoredEvents = (events) => {
  try {
    localStorage.setItem("raiku_events", JSON.stringify(events));
  } catch (e) {
    console.error("Error saving events to localStorage", e);
  }
};

// Helper to get my pending host requests
export const getStoredRequests = () => {
  try {
    const data = localStorage.getItem("myHostedRequests");
    if (!data) {
      localStorage.setItem("myHostedRequests", JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading host requests from localStorage", e);
    return INITIAL_REQUESTS;
  }
};

// Helper to save my pending host requests
export const setStoredRequests = (requests) => {
  try {
    localStorage.setItem("myHostedRequests", JSON.stringify(requests));
  } catch (e) {
    console.error("Error saving host requests to localStorage", e);
  }
};
