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
export function setupLogForwarder(source = "unknown", isDev = true) {
  if (!isDev) return;

  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };

  const sendToServer = (level, args) => {
    // Serialize args safely (handle circular refs, complex objects)
    const serializedArgs = args.map(arg => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
      } catch (e) {
        return String(arg);
      }
    });

    // Send to log server on port 5123
    fetch('http://localhost:5123/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        args: serializedArgs,
        meta: source,
      }),
      keepalive: true,
    }).catch(() => {}); // Silently fail if log server is down
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
