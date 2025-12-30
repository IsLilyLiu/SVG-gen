<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1pFAhxwrkjHArdsCk_PywqIDRtd-ycoLS

## Run Locally

**Prerequisites:** Node.js (>=18)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root and add your Gemini API key (server-side only):

   ```bash
   # .env.local
   GEMINI_AIP_KEY=your_real_api_key_here
   ```

   Do NOT commit `.env.local` to source control. The key is read only on the server side and never exposed to the browser.

3. Run the app in development:

   ```bash
   npm run dev
   ```

4. Build and run production:

   ```bash
   npm run build
   npm run start
   ```
