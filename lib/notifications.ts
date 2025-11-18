import { format } from 'date-fns';
import { sendMail } from './sendMail';

interface ShipmentNotificationData {
  code: string;
  customerName: string;
  customerEmail: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery?: Date | string | null;
}

export async function sendShipmentStatusNotification(shipment: ShipmentNotificationData) {
  const statusEmoji: Record<string, string> = {
    'Pending': '⏳',
    'In Transit': '🚢',
    'Customs': '📋',
    'Out for Delivery': '🚚',
    'Delivered': '✅',
    'Delayed': '⚠️',
  };

  const subject = `${statusEmoji[shipment.status] || '📦'} Shipment Update: ${shipment.code}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { display: inline-block; padding: 8px 16px; background: #dc2626; color: white; border-radius: 20px; font-weight: bold; margin: 10px 0; }
        .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #dc2626; }
        .info-label { font-weight: bold; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌏 Asian Shipping Thai</h1>
          <p>Shipment Status Update</p>
        </div>
        <div class="content">
          <p>Hello ${shipment.customerName},</p>
          <p>Your shipment status has been updated:</p>
          
          <div class="status-badge">${statusEmoji[shipment.status]} ${shipment.status.toUpperCase()}</div>
          
          <div class="info-row">
            <div class="info-label">Tracking Number:</div>
            <div>${shipment.code}</div>
          </div>
          
          <div class="info-row">
            <div class="info-label">Route:</div>
            <div>${shipment.origin} → ${shipment.destination}</div>
          </div>
          
          ${shipment.estimatedDelivery ? `
          <div class="info-row">
            <div class="info-label">Estimated Delivery:</div>
            <div>${format(new Date(shipment.estimatedDelivery), 'MMMM dd, yyyy')}</div>
          </div>
          ` : ''}
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/tracking/${shipment.code}" class="button">
              Track Shipment
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666;">
            Questions? Contact our support team at support@asianshippingthai.com
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Asian Shipping Thai. All rights reserved.</p>
          <p>You received this email because you have an active shipment with us.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Hello ${shipment.customerName},

Your shipment status has been updated:

Status: ${shipment.status}
Tracking Number: ${shipment.code}
Route: ${shipment.origin} → ${shipment.destination}
${shipment.estimatedDelivery ? `Estimated Delivery: ${format(new Date(shipment.estimatedDelivery), 'MMMM dd, yyyy')}` : ''}

Track your shipment: ${process.env.NEXTAUTH_URL}/tracking/${shipment.code}

Questions? Contact us at support@asianshippingthai.com

---
Asian Shipping Thai
  `;

  try {
    await sendMail({
      to: shipment.customerEmail,
      replyTo: process.env.MAIL_TO || 'support@asianshippingthai.com',
      subject,
      text,
      html,
    });
    console.log(`Notification sent to ${shipment.customerEmail} for shipment ${shipment.code}`);
  } catch (error) {
    console.error('Failed to send notification:', error);
    throw error;
  }
}

export async function sendPaymentConfirmation(shipment: ShipmentNotificationData & { price: number }) {
  const subject = `💳 Payment Confirmed - ${shipment.code}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
        .info-row { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #10b981; }
        .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Confirmed</h1>
        </div>
        <div class="content">
          <p>Hello ${shipment.customerName},</p>
          <p>We've received your payment. Thank you for your business!</p>
          
          <div class="amount">$${shipment.price.toFixed(2)}</div>
          
          <div class="info-row">
            <strong>Shipment:</strong> ${shipment.code}
          </div>
          <div class="info-row">
            <strong>Route:</strong> ${shipment.origin} → ${shipment.destination}
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/portal" class="button">
              View Dashboard
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #666;">
            A detailed invoice has been sent to your email.
          </p>
        </div>
        <div class="footer">
          <p>&copy; 2025 Asian Shipping Thai</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendMail({
      to: shipment.customerEmail,
      replyTo: process.env.MAIL_TO || 'support@asianshippingthai.com',
      subject,
      html,
    });
  } catch (error) {
    console.error('Failed to send payment confirmation:', error);
  }
}
