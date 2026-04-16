
import nodemailer from 'nodemailer';

/**
 * Platform Email Configuration
 * 
 * To use a real SMTP server, add these to your .env:
 * SMTP_HOST=
 * SMTP_PORT=
 * SMTP_USER=
 * SMTP_PASS=
 */

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const isProd = process.env.NODE_ENV === 'production';
  const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER;

  if (hasSmtp) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development fallback: Ethereal (Mock)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('--- EMAIL DEV MODE ---');
    console.log('Ethereal Account:', testAccount.user);
    console.log('--- EMAIL DEV MODE ---');
  }

  return transporter;
}

export async function sendBookingConfirmation(orderData: any) {
  const mailer = await getTransporter();
  const { order, event, user, quantity } = orderData;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const ticketUrl = `${siteUrl}/tickets`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 20px; overflow: hidden; padding: 40px; box-shadow: 0 40px 100px rgba(0,0,0,1); }
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase; font-style: italic; color: #fff; margin-bottom: 40px; border-bottom: 2px solid #ef4444; display: inline-block; }
        h1 { font-size: 32px; font-weight: 900; margin: 0 0 10px; letter-spacing: -1px; background: linear-gradient(to right, #cf9fff, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #888; margin-bottom: 30px; line-height: 1.6; }
        .receipt { background: #111; border: 1px solid #222; border-radius: 12px; padding: 25px; margin-bottom: 30px; font-family: monospace; }
        .row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
        .row.total { border-top: 1px dashed #333; margin-top: 15px; pt-15px; font-size: 16px; font-weight: bold; color: #fff; padding-top: 15px; }
        .event-card { background: #111; border-radius: 12px; padding: 20px; margin-bottom: 40px; border-left: 4px solid #ef4444; }
        .event-title { font-weight: 900; font-size: 18px; color: #fff; margin-bottom: 5px; text-transform: uppercase; }
        .event-info { font-size: 12px; color: #666; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .btn { display: inline-block; background: #fff; color: #000; font-weight: 900; padding: 18px 30px; border-radius: 12px; text-decoration: none; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; transition: all 0.3s; }
        .footer { margin-top: 40px; font-size: 11px; color: #444; text-transform: uppercase; letter-spacing: 2px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Ticketa</div>
        <h1>Confirmed.</h1>
        <p>Success, ${user.name}. Your digital pass for ${event.title} is now encrypted and safe in your vault.</p>

        <div class="event-card">
          <div class="event-title">${event.title}</div>
          <div class="event-info">${event.startTime ? new Date(event.startTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Upcoming Event'} &bull; ${event.location}</div>
        </div>

        <div class="receipt">
          <div class="row">
            <span>Ticket: ${order.ticketType?.name || 'Standard'} x${quantity}</span>
            <span>$${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div class="row" style="color: #666;">
            <span>Service Fee & Security</span>
            <span>$${Number(order.serviceFee).toFixed(2)}</span>
          </div>
          <div class="row total">
            <span>Total Paid</span>
            <span>ZMW ${Number(order.amount).toFixed(2)}</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #666; font-style: italic; margin-bottom: 20px;">
          * For the fastest entry at the venue, download your <b>Mobile Wallet PDF Pass</b> from your dashboard.
        </p>

        <a href="${ticketUrl}" class="btn">Get PDF Tickets</a>

        <div class="footer">
          Order ID: #${order.id.slice(0, 8).toUpperCase()} &bull; Secure Digital Transaction
        </div>
      </div>
    </body>
    </html>
  `;

  const info = await mailer.sendMail({
    from: '"Ticketa Marketplace" <no-reply@ticketa.io>',
    to: user.email,
    subject: `Order Success: ${event.title}`,
    html: html,
    text: `Your tickets for ${event.title} are ready! View them here: ${ticketUrl}`,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('--- EMAIL SENT ---');
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('--- EMAIL SENT ---');
  }

  return info;
}

export async function sendSettlementNotification(payoutData: {
  user: { name: string; email: string };
  amount: number;
  date: Date;
}) {
  const mailer = await getTransporter();
  const { user, amount, date } = payoutData;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; padding: 40px; }
        .logo { font-size: 20px; font-weight: 900; color: #fff; margin-bottom: 30px; text-transform: uppercase; border-bottom: 2px solid #a855f7; display: inline-block; }
        h1 { font-size: 32px; font-weight: 900; margin-bottom: 10px; background: linear-gradient(to right, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .amount-card { background: #111; border: 1px solid #222; border-radius: 16px; padding: 30px; margin: 30px 0; text-align: center; }
        .amount { font-size: 40px; font-weight: 900; color: #fff; margin: 10px 0; }
        .label { font-size: 10px; font-weight: 900; color: #555; text-transform: uppercase; letter-spacing: 2px; }
        p { color: #888; line-height: 1.6; }
        .footer { margin-top: 40px; font-size: 10px; color: #333; text-transform: uppercase; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Ticketa Admin</div>
        <h1>Settlement Processed.</h1>
        <p>Hello ${user.name}, we have successfully processed your marketplace settlement. The funds are now being routed via your chosen payment rail.</p>
        
        <div class="amount-card">
          <div class="label">Total Disbursed</div>
          <div class="amount">ZMW ${Number(amount).toLocaleString()}</div>
          <div class="label">${date.toLocaleDateString('en-ZM', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        </div>

        <p>Should the funds not reflect in your account within 24 hours (for Mobile Money) or 48 hours (for Bank Transfers), please contact treasury@ticketa.io.</p>
        
        <div class="footer">Automated Treasury Receipt &bull; Transaction Reconciled</div>
      </div>
    </body>
    </html>
  `;

  return await mailer.sendMail({
    from: '"Ticketa Treasury" <treasury@ticketa.io>',
    to: user.email,
    subject: `Settlement Confirmed: ZMW ${amount}`,
    html: html,
    text: `Your settlement of ZMW ${amount} has been processed. Check your dashboard for details.`,
  });
}
