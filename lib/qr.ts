import QRCode from 'qrcode';
import crypto from 'crypto';

const QR_SECRET = process.env.QR_SECRET || 'fallback-secret-for-dev-only';

/**
 * Generates a signed token for a ticket.
 * Mode: 'LIVE' (rotating) or 'MASTER' (static PDF)
 */
export function generateSignedToken(ticketId: string, mode: 'LIVE' | 'MASTER' = 'LIVE'): string {
  const timestamp = mode === 'LIVE' ? Date.now() : 0;
  const data = `${mode}:${ticketId}:${timestamp}`;
  const signature = crypto
    .createHmac('sha256', QR_SECRET)
    .update(data)
    .digest('hex');
  
  return `${data}:${signature}`;
}

/**
 * Verifies a signed token and returns the ticketId if valid.
 */
export function verifySignedToken(token: string): { ticketId: string; mode: string } | null {
  try {
    const parts = token.split(':');
    if (parts.length < 4) {
      // Handle legacy tokens (backward compatibility during migration)
      const [ticketId, timestampStr, signature] = parts;
      const data = `${ticketId}:${timestampStr}`;
      const expectedSignature = crypto.createHmac('sha256', QR_SECRET).update(data).digest('hex');
      return signature === expectedSignature ? { ticketId, mode: 'LIVE' } : null;
    }

    const [mode, ticketId, timestampStr, signature] = parts;
    const timestamp = parseInt(timestampStr);
    const data = `${mode}:${ticketId}:${timestampStr}`;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', QR_SECRET)
      .update(data)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return null;
    }

    // Only check TTL for LIVE tokens
    if (mode === 'LIVE') {
      const fiveMinutes = 5 * 60 * 1000;
      if (Date.now() - timestamp > fiveMinutes) {
        return null;
      }
    }

    return { ticketId, mode };
  } catch (err) {
    return null;
  }
}

/**
 * Generates an SVG QR code from the provided string.
 */
export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrSvg = await QRCode.toString(text, {
      type: 'svg',
      color: {
        dark: '#ffffff',
        light: '#00000000',
      },
      margin: 1,
    });
    return qrSvg;
  } catch (err) {
    console.error('Error generating QR code:', err);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generates a Data URL for the QR code (Base64).
 */
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(text, {
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      margin: 2,
    });
    return qrDataUrl;
  } catch (err) {
    console.error('Error generating QR code DataURL:', err);
    throw new Error('Failed to generate QR code');
  }
}
