/* Native side of pl.zb3.freej2me.bridge.http.HttpBridge: sends the request to the site's /api/proxy relay. */
const enc = new TextEncoder();

function pack(status, headerText, bodyBytes) {
  const h = enc.encode(headerText);
  const out = new Uint8Array(8 + h.length + bodyBytes.length);
  const dv = new DataView(out.buffer);
  dv.setInt32(0, status); dv.setInt32(4, h.length);
  out.set(h, 8); out.set(bodyBytes, 8 + h.length);
  return new Int8Array(out.buffer);
}
const fail = msg => pack(-1, '', enc.encode(msg));

function toBase64(int8) {
  const u = new Uint8Array(int8.buffer, int8.byteOffset, int8.byteLength);
  let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(s);
}
function fromBase64(b64) {
  const s = atob(b64), u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}

export const httpBridgeNatives = {
  async Java_pl_zb3_freej2me_bridge_http_HttpBridge_request(lib, method, url, headers, body) {
    try {
      const r = await fetch(new URL('api/proxy', location.href), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ method, url, headers, body: body && body.length ? toBase64(body) : null })
      });
      if (!r.ok && r.status !== 502 && r.status !== 403 && r.status !== 413 && r.status !== 400) return fail('Network is not available on this host (relay answered ' + r.status + '). Host CloudJava on Vercel.');
      const j = await r.json();
      if (j.error) return fail(j.error);
      return pack(j.status, j.headers.map(([k, v]) => k + ': ' + v).join('\n'), fromBase64(j.body));
    } catch (e) {
      return fail('Network error: ' + e);
    }
  }
};
