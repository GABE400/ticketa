
import 'dotenv/config';
import { getPesapalToken } from './lib/pesapal';

async function testPesapal() {
    console.log("--- Testing PesaPal Connection ---");
    console.log("Environment:", process.env.PESAPAL_SANDBOX === 'true' ? 'SANDBOX' : 'PRODUCTION');
    console.log("Consumer Key:", process.env.PESAPAL_CONSUMER_KEY ? "PRESENT" : "MISSING");
    
    try {
        console.log("Requesting token...");
        const token = await getPesapalToken();
        if (token) {
            console.log("✅ Success! Obtained PesaPal Token:", token.substring(0, 10) + "...");
        } else {
            console.log("❌ Failed! Token is null or empty.");
        }
    } catch (error) {
        console.error("❌ Connection Error:", error);
    }
}

testPesapal();
