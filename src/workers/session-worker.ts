import { isSessionRequest, SessionHost, type SessionResponse } from "../engine/protocol";

declare const self: { onconnect: (event: MessageEvent) => void };

const host = new SessionHost(`session-${crypto.randomUUID()}`);
const ports = new Map<MessagePort, number>();
let lastTick = performance.now();
let failed = false;

function post(port: MessagePort, response: SessionResponse) {
  try {
    port.postMessage(response);
  } catch {
    ports.delete(port);
    port.close();
  }
}

function broadcast(response: SessionResponse) {
  for (const port of ports.keys()) post(port, response);
}

function advanceClock() {
  const now = performance.now();
  const elapsed = now - lastTick;
  lastTick = now;
  return !failed && host.advance(elapsed);
}

setInterval(() => {
  try {
    if (advanceClock()) broadcast(host.snapshot());
    for (const [port, lastSeen] of ports) {
      if (Date.now() - lastSeen > 180000) {
        post(port, { ...host.snapshot("Connexion expiree : reconnectez cette vue"), type: "DISCONNECTED" });
        ports.delete(port);
        port.close();
      }
    }
  } catch (error) {
    failed = true;
    broadcast(host.snapshot(error instanceof Error ? error.message : "Erreur du moteur"));
  }
}, 100);

self.onconnect = (event: MessageEvent) => {
  const port = event.ports[0];
  port.onmessage = ({ data }: MessageEvent<unknown>) => {
    try {
      if (!isSessionRequest(data)) {
        post(port, host.snapshot("Commande invalide ou version incompatible"));
        return;
      }
      if (data.type === "DISCONNECT") {
        ports.delete(port);
        port.close();
        return;
      }
      ports.set(port, Date.now());
      if (data.type === "CONTROL" || data.type === "RESET") advanceClock();
      const response = host.receive(data);
      if (data.type === "RESET" && response.type !== "ERROR") {
        failed = false;
        lastTick = performance.now();
      }
      if ((data.type === "RESET" || data.type === "CONTROL") && response.type !== "ERROR") broadcast(response);
      else post(port, response);
    } catch (error) {
      post(port, host.snapshot(error instanceof Error ? error.message : "Commande impossible"));
    }
  };
  port.onmessageerror = () => {
    ports.delete(port);
    port.close();
  };
  port.start();
};
