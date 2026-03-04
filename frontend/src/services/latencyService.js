/**
 * Measures the Round Trip Time (RTT) to a target URL.
 * Uses a 'no-cors' HEAD request to avoid blocking errors.
 * * @param {string} url - The endpoint to ping
 * @returns {Promise<number>} - Latency in milliseconds (9999 if unreachable)
 */
export const measureLatency = async (url) => {
  if (!url) return 9999;
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(cleanUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: controller.signal });
    const start = performance.now();

    await fetch(cleanUrl, { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: controller.signal });

    const end = performance.now();
    clearTimeout(timeout);
    return Math.round(end - start);

  } catch (error) {
    return 9999;
  }
};