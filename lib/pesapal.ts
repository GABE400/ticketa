const PESAPAL_URL = process.env.PESAPAL_SANDBOX === 'true' 
  ? 'https://cybqa.pesapal.com/pesapalv3' 
  : 'https://pay.pesapal.com/v3';

export async function getPesapalToken() {
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
  return data.token;
}

export async function registerPesapalOrder(token: string, orderData: {
  id: string,
  amount: number,
  currency: string,
  description: string,
  callback_url: string,
  notification_id: string,
  billing_address: {
    email_address: string,
    phone_number?: string,
    first_name?: string,
    last_name?: string,
  }
}) {
  const response = await fetch(`${PESAPAL_URL}/api/Transactions/SubmitOrderRequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: orderData.id,
      currency: orderData.currency,
      amount: orderData.amount,
      description: orderData.description,
      callback_url: orderData.callback_url,
      notification_id: orderData.notification_id,
      billing_address: orderData.billing_address,
    }),
  });

  return await response.json();
}

export async function getPesapalTransactionStatus(token: string, trackingId: string) {
  const response = await fetch(`${PESAPAL_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${trackingId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return await response.json();
}
