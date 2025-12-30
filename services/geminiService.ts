/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const generateSvgFromPrompt = async (prompt: string): Promise<string> => {
  const resp = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!resp.ok) {
    const errorBody = await resp.json().catch(() => ({}));
    // Normalize error into a readable string
    let msg = `Server responded with ${resp.status}`;
    if (errorBody) {
      const e = errorBody.error ?? errorBody;
      if (typeof e === 'string') {
        msg = e;
      } else if (e && typeof e === 'object') {
        if (e.message) msg = String(e.message);
        else if (e.upstream && typeof e.upstream === 'object') {
          const code = e.upstream.code ?? e.upstream.status ?? 'unknown';
          const umsg = e.upstream.message ?? JSON.stringify(e.upstream);
          msg = `Upstream ${code}: ${umsg}`;
        } else {
          try { msg = JSON.stringify(e); } catch { msg = String(e); }
        }
      }
    }
    throw new Error(msg);
  }

  const body = await resp.json();
  if (!body?.svg) throw new Error('No svg returned from server');
  return body.svg as string;
};
