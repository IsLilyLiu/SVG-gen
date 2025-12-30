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
    const msg = errorBody?.error || `Server responded with ${resp.status}`;
    throw new Error(msg);
  }

  const body = await resp.json();
  if (!body?.svg) throw new Error('No svg returned from server');
  return body.svg as string;
};
