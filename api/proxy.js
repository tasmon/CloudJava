/* CloudJava network relay (Vercel serverless function).
   Receives { method, url, headers, body(base64) } from the app on the same site and performs the
   HTTP/HTTPS request on its behalf, so J2ME apps can go online. Only same-site callers are served,
   private/internal addresses are refused, and size/time are limited. */
const dns = require('dns').promises;
const net = require('net');

const MAX_BODY = 3 * 1024 * 1024;
const BLOCKED_PORTS = new Set([22, 23, 25, 110, 143, 465, 587, 993, 995]);
const DROP = new Set(['host', 'connection', 'content-length', 'transfer-encoding', 'origin', 'referer', 'cookie2', 'upgrade', 'proxy-authorization']);

function isPrivate(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) return isPrivate(v.slice(7));
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe8') || v.startsWith('fe9') || v.startsWith('fea') || v.startsWith('feb');
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const fail = (code, error) => res.status(code).json({ error });
  if (req.method !== 'POST') return fail(405, 'POST only');
  try {  /* same-site callers only */
    const origin = req.headers.origin;
    if (req.headers['sec-fetch-site'] === 'cross-site') return fail(403, 'Cross-site use is not allowed');
    if (origin && new URL(origin).host !== req.headers.host) return fail(403, 'Cross-site use is not allowed');
  } catch (e) { return fail(400, 'Bad origin'); }

  let { method, url, headers, body } = req.body || {};
  method = String(method || 'GET').toUpperCase();
  if (!['GET', 'POST', 'HEAD'].includes(method)) return fail(400, 'Method not allowed');
  let u;
  try { u = new URL(url); } catch (e) { return fail(400, 'Bad URL'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return fail(400, 'Only http and https');
  const port = Number(u.port || (u.protocol === 'https:' ? 443 : 80));
  if (BLOCKED_PORTS.has(port)) return fail(403, 'Port not allowed');
  try {
    const host = u.hostname.replace(/^\[|\]$/g, '');
    const addrs = net.isIP(host) ? [{ address: host }] : await dns.lookup(host, { all: true });
    if (!addrs.length || addrs.some(a => isPrivate(a.address))) return fail(403, 'Address not allowed');
  } catch (e) { return fail(502, 'Cannot resolve host'); }

  const h = {};
  String(headers || '').split('\n').forEach(line => {
    const i = line.indexOf(':'); if (i < 1) return;
    const k = line.slice(0, i).trim(), v = line.slice(i + 1).trim();
    if (k && !DROP.has(k.toLowerCase())) h[k] = v;
  });
  if (!Object.keys(h).some(k => k.toLowerCase() === 'user-agent')) h['User-Agent'] = 'Mozilla/5.0 (compatible; CloudJava)';

  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(u.href, { method, headers: h, redirect: 'manual', signal: ctl.signal,
      body: method === 'POST' && body ? Buffer.from(body, 'base64') : undefined });
    const chunks = []; let total = 0;
    if (r.body && method !== 'HEAD') {
      for await (const c of r.body) { total += c.length; if (total > MAX_BODY) { ctl.abort(); return fail(413, 'Response too large'); } chunks.push(c); }
    }
    const buf = Buffer.concat(chunks);
    const out = [];
    r.headers.forEach((v, k) => { if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection', 'set-cookie'].includes(k)) out.push([k, v]); });
    (r.headers.getSetCookie ? r.headers.getSetCookie() : []).forEach(c => out.push(['set-cookie', c]));
    out.push(['content-length', String(buf.length)]);
    return res.status(200).json({ status: r.status, headers: out, body: buf.toString('base64') });
  } catch (e) {
    return fail(502, e.name === 'AbortError' ? 'Request timed out' : 'Request failed: ' + (e.cause && e.cause.code || e.message));
  } finally { clearTimeout(timer); }
};
