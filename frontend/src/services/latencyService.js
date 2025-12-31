/**
 * Measures the Round Trip Time (RTT) to a target URL.
 * Uses a 'no-cors' HEAD request to avoid blocking errors.
 * * @param {string} url - The endpoint to ping
 * @returns {Promise<number>} - Latency in milliseconds (or 0 if unreachable)
 */
export const measureLatency = async (url) => {
    if (!url) return 0;
    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
    try {
      // --- STEP 1: WARM UP (The "Handshake" Request) ---
      // We fire this just to establish the TCP/TLS connection.
      // We DON'T measure the time for this one.
      await fetch(cleanUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
  
      // --- STEP 2: MEASURE (The "Data" Request) ---
      // Now that the pipe is open (Keep-Alive), this measures pure latency.
      const start = performance.now();
      
      await fetch(cleanUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store' });
      
      const end = performance.now();
      return Math.round(end - start);
  
    } catch (error) {
      // If it fails, return 0 (or a high penalty value)
      return 0; 
    }
  };