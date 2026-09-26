/**
 * ==========================================================================
 * LOG FORWARDER - Redirect console logs to VS Code terminal
 * ==========================================================================
 * 
 * This utility allows both browser and SharedWorker contexts to forward
 * their console logs to the development server, which displays them in
 * the VS Code terminal.
 * 
 * Usage:
 * - Browser: Automatically called in src/index.jsx
 * - SharedWorker: Call setupLogForwarder() in the worker startup
 */

/**
 * Setup log forwarding for a context (browser or worker)
 * Intercepts console.log, console.warn, console.error and sends to server
 * 
 * @param source - Source identifier ("browser:vue1", "worker", etc.)
 * @param isDev - Whether in dev mode (should check import.meta.env.DEV for browser)
 */
export function setupLogForwarder(source = "unknown", isDev = false) {
  if (!isDev || '__jffForwarderInstalled' in console) return;
  Object.defineProperty(console, '__jffForwarderInstalled', { value: true });

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  let windowStart = performance.now();
  let sent = 0;
  const sendToServer = (level: keyof typeof originalConsole, args: unknown[]) => {
    const now = performance.now();
    if (now - windowStart >= 1000) { windowStart = now; sent = 0; }
    if (sent++ >= 10) return;
    const serializedArgs = args.slice(0, 32).map(arg => {
      try {
        return (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))?.slice(0, 2048);
      } catch {
        return '[Unserializable log value]';
      }
    });
    const body = JSON.stringify({ level, args: serializedArgs, meta: source });
    if (new TextEncoder().encode(body).byteLength > 32768) return;
    fetch('http://127.0.0.1:5123/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined);
  };

  // Override console methods
  console.log = (...args) => {
    originalConsole.log(...args);
    sendToServer('log', args);
  };

  console.warn = (...args) => {
    originalConsole.warn(...args);
    sendToServer('warn', args);
  };

  console.error = (...args) => {
    originalConsole.error(...args);
    sendToServer('error', args);
  };
}
