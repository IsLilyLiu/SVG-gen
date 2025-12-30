import type { NextApiRequest, NextApiResponse } from 'next';

// Safe diagnostic endpoint: only reports presence/absence of expected env vars.
// NEVER return actual key values.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const hasAip = Boolean(process.env.GEMINI_AIP_KEY);
  const hasApi = Boolean(process.env.GEMINI_API_KEY);
  const presentKey = hasApi ? 'GEMINI_API_KEY' : hasAip ? 'GEMINI_AIP_KEY' : null;

  return res.status(200).json({ hasGEMINI_AIP_KEY: hasAip, hasGEMINI_API_KEY: hasApi, presentKey });
}
