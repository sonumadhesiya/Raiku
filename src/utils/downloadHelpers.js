// Download photo/image file helper
export const downloadImage = async (url, filename) => {
  try {
    if (!url) return;
    
    // If it's a data URL or blob URL, trigger download directly
    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // For relative or remote URLs, fetch and convert to blob to force browser download
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error downloading image:", error);
    // Fallback: open in new tab or direct download link
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};

// Export CSV helper for regional events
export const exportRegionalCSV = (events) => {
  const regional = events.filter(e => e.eventType === 'regional' || !e.eventType);
  
  const headers = ["S.No", "Event Name", "Event Date & Time (IST)", "Host Name", "Discord Username", "Status"];
  const rows = regional.map((e, idx) => [
    idx + 1,
    `"${(e.title || '').replace(/"/g, '""')}"`,
    `"${(e.date || '')} ${e.timeString || ''}"`,
    `"${(e.hostName || '').replace(/"/g, '""')}"`,
    `"${(e.discordUsername || e.discordName || '').replace(/"/g, '""')}"`,
    e.status || 'upcoming'
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `regional_events_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
