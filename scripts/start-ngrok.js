const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

async function startNgrok() {
  try {
    // Connect to ngrok
    const url = await ngrok.connect({
      addr: 3000, // Your Next.js port
      region: 'us', // or 'eu', 'au', 'ap', 'sa', 'jp', 'in'
    });

    console.log(`
    ┌────────────────────────────────────────────────┐
    │                                                │
    │   Ngrok tunnel is running!                     │
    │                                                │
    │   ${url}                     │
    │                                                │
    │   Your Adyen webhook URL is:                   │
    │   ${url}/api/webhooks/adyen                    │
    │                                                │
    │   Use this URL in your Adyen Customer Area     │
    │   when setting up the webhook.                 │
    │                                                │
    └────────────────────────────────────────────────┘
    `);

    // Save the URL to a file for reference
    const ngrokInfo = {
      url,
      webhookUrl: `${url}/api/webhooks/adyen`,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(__dirname, '../ngrok-info.json'),
      JSON.stringify(ngrokInfo, null, 2)
    );

  } catch (error) {
    console.error('Error starting ngrok:', error);
  }
}

startNgrok();