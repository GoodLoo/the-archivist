export function buildOrderConfirmationHtml(order: {
  orderNumber: string;
  customer: string;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  address: string;
  items: { name: string; quantity: number; price: number }[];
}) {
  const itemsRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #333;font-size:13px;color:#a0a0a0;">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #333;font-size:13px;color:#a0a0a0;text-align:center;">${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #333;font-size:13px;color:#e5e2e1;text-align:right;font-weight:600;">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#141313;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#141313;padding:40px 20px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

<tr>
<td style="text-align:center;padding-bottom:32px;">
<h1 style="font-family:'Space Grotesk',Inter,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.5px;margin:0;color:#e5e2e1;">
THE <span style="color:#dc143c;">ARCHIVIST</span>
</h1>
<p style="font-size:11px;color:#a0a0a0;margin:4px 0 0 0;letter-spacing:2px;text-transform:uppercase;">Premium Figurines &amp; Collectibles</p>
</td>
</tr>

<tr>
<td style="background-color:#1c1b1b;border:1px solid #333;padding:40px 36px;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="text-align:center;padding-bottom:24px;">
<div style="display:inline-block;width:56px;height:56px;border:2px solid #dc143c;border-radius:50%;line-height:56px;font-size:28px;color:#dc143c;font-weight:700;font-family:'Space Grotesk',sans-serif;">&#10003;</div>
<h2 style="font-family:'Space Grotesk',Inter,sans-serif;font-size:22px;font-weight:700;color:#e5e2e1;margin:16px 0 4px 0;">Order Confirmed</h2>
<p style="font-size:13px;color:#a0a0a0;margin:0;">${order.orderNumber}</p>
</td></tr>
</table>

<p style="font-size:14px;color:#e5e2e1;margin:0 0 4px 0;">Hi <strong style="color:#dc143c;">${order.customer}</strong>,</p>
<p style="font-size:14px;line-height:1.7;color:#a0a0a0;margin:0 0 24px 0;">Your payment has been received and your order is confirmed. We're preparing your collectibles for shipping.</p>

<div style="height:1px;background-color:#333;margin:0 0 24px 0;"></div>

<h3 style="font-family:'Space Grotesk',Inter,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#dc143c;margin:0 0 12px 0;">Order Summary</h3>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<thead>
<tr>
<th style="padding:8px 0;border-bottom:1px solid #dc143c;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:left;">Item</th>
<th style="padding:8px 0;border-bottom:1px solid #dc143c;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:center;">Qty</th>
<th style="padding:8px 0;border-bottom:1px solid #dc143c;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#666;text-align:right;">Total</th>
</tr>
</thead>
<tbody>
${itemsRows}
</tbody>
</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
<tr><td style="padding:4px 0;font-size:13px;color:#a0a0a0;">Subtotal</td><td style="padding:4px 0;font-size:13px;color:#e5e2e1;text-align:right;font-weight:600;">$${order.subtotal.toFixed(2)}</td></tr>
<tr><td style="padding:4px 0;font-size:13px;color:#a0a0a0;">Shipping</td><td style="padding:4px 0;font-size:13px;color:#e5e2e1;text-align:right;">${order.shipping === 0 ? '<span style="color:#22c55e;">Free</span>' : `$${order.shipping.toFixed(2)}`}</td></tr>
<tr><td style="padding:4px 0;font-size:13px;color:#a0a0a0;">Tax</td><td style="padding:4px 0;font-size:13px;color:#e5e2e1;text-align:right;">$${order.tax.toFixed(2)}</td></tr>
<tr><td style="padding:12px 0 4px 0;border-top:1px solid #dc143c;font-size:15px;font-weight:700;color:#dc143c;">Total</td><td style="padding:12px 0 4px 0;border-top:1px solid #dc143c;font-size:15px;font-weight:700;color:#dc143c;text-align:right;">$${order.total.toFixed(2)}</td></tr>
</table>

<div style="height:1px;background-color:#333;margin:24px 0;"></div>

<h3 style="font-family:'Space Grotesk',Inter,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#dc143c;margin:0 0 8px 0;">Shipping To</h3>
<p style="font-size:13px;line-height:1.6;color:#a0a0a0;margin:0;">${order.address}</p>

</td>
</tr>

<tr>
<td style="text-align:center;padding-top:24px;">
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
<tr>
<td align="center" style="background-color:#dc143c;">
<a href="https://the-archivist-lemon.vercel.app/track-order" target="_blank" style="display:inline-block;font-family:Inter,sans-serif;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;color:#fff;padding:12px 28px;border:1px solid #dc143c;">Track Your Order</a>
</td>
</tr>
</table>
<p style="font-size:11px;color:#555;margin:0 0 4px 0;">The Archivist &mdash; Premium Figurines &amp; Collectibles</p>
<p style="font-size:10px;color:#444;margin:0;">&copy; 2026 The Archivist. All rights reserved.</p>
</td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
