
// import 'dotenv/config'; // Not needed if run with node --env-file
// fetch is global in Node 24

const PESAPAL_URL = process.env.PESAPAL_SANDBOX === 'true' 
  ? 'https://cybqa.pesapal.com/pesapalv3' 
  : 'https://pay.pesapal.com/v3';

async function testPesapal() {
  console.log("--- Testing PesaPal Connection ---");
  console.log("URL:", PESAPAL_URL);
  console.log("Sandbox:", process.env.PESAPAL_SANDBOX);
  
  if (!process.env.PESAPAL_CONSUMER_KEY || !process.env.PESAPAL_CONSUMER_SECRET) {
    console.error("❌ Error: PesaPal credentials missing from environment.");
    return;
  }

  try {
    console.log("Requesting token for Key:", process.env.PESAPAL_CONSUMER_KEY.substring(0, 5) + "...");
    const response = await fetch(`${PESAPAL_URL}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }),
    });

    const data = await response.json();
    if (data.token) {
      console.log("✅ Success! Obtained PesaPal Token:", data.token.substring(0, 10) + "...");
    } else {
      console.log("❌ Failed! Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Connection Error:", error);
  }
}

testPesapal();
