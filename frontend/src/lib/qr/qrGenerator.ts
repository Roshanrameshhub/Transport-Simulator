const REGISTRY_KEY = 'simuchennai_qr_registry';
const MAX_COLLISION_RETRIES = 12;

interface QrRegistryEntry {
  code: string;
  payloadHash: string;
  createdAt: number;
}

function loadRegistry(): QrRegistryEntry[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as QrRegistryEntry[];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return parsed.filter((e) => e.createdAt > weekAgo);
  } catch {
    return [];
  }
}

function saveRegistry(entries: QrRegistryEntry[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(entries.slice(-500)));
}

function hashPayload(payload: string): string {
  let h = 0;
  for (let i = 0; i < payload.length; i++) {
    h = (h << 5) - h + payload.charCodeAt(i);
    h |= 0;
  }
  return `h${Math.abs(h)}`;
}

function randomSegment(len = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function generateJourneyCodeCandidate(): string {
  return `CHN-${randomSegment()}-${randomSegment()}`;
}

export function isCodeRegistered(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return loadRegistry().some((e) => e.code === normalized);
}

export function isPayloadRegistered(payload: string): boolean {
  const h = hashPayload(payload);
  return loadRegistry().some((e) => e.payloadHash === h);
}

/** Register code + payload; returns false if duplicate detected */
export function registerQrEntry(code: string, payload: string): boolean {
  const normalized = code.trim().toUpperCase();
  const payloadHash = hashPayload(payload);

  if (isCodeRegistered(normalized) || isPayloadRegistered(payload)) {
    return false;
  }

  const registry = loadRegistry();
  registry.push({ code: normalized, payloadHash, createdAt: Date.now() });
  saveRegistry(registry);
  return true;
}

/**
 * Generates unique journey code with collision checks and auto-regeneration.
 */
export function generateUniqueJourneyCode(): string {
  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
    const code = generateJourneyCodeCandidate();
    if (!isCodeRegistered(code)) {
      return code;
    }
  }
  return `CHN-${Date.now().toString(36).toUpperCase().slice(-8)}`;
}

export function buildUniqueQrPayload(
  journeyCode: string,
  start: string,
  end: string,
  clientRef: string,
): { payload: string; code: string } {
  for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
    const code =
      attempt === 0 ? journeyCode.trim().toUpperCase() : generateUniqueJourneyCode();
    const payload = JSON.stringify({
      v: 1,
      city: 'Chennai',
      code,
      ref: clientRef,
      from: start,
      to: end,
      ts: Date.now(),
      nonce: randomSegment(6),
    });

    if (registerQrEntry(code, payload)) {
      return { payload, code };
    }
  }

  const code = generateUniqueJourneyCode();
  const payload = JSON.stringify({
    v: 1,
    city: 'Chennai',
    code,
    ref: clientRef,
    from: start,
    to: end,
    ts: Date.now(),
    nonce: randomSegment(8),
  });
  registerQrEntry(code, payload);
  return { payload, code };
}

export function parseQrPayload(raw: string): { code?: string; ref?: string } | null {
  try {
    const data = JSON.parse(raw) as { code?: string; ref?: string };
    if (typeof data === 'object' && data !== null) return data;
    return null;
  } catch {
    const trimmed = raw.trim().toUpperCase();
    if (/^CHN-[A-Z0-9]+-[A-Z0-9]+$/.test(trimmed)) return { code: trimmed };
    if (/^SCB-/.test(trimmed)) return { ref: trimmed };
    return null;
  }
}
