const ORDER_STATUS_LABELS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const ORDER_STATUS_COLORS = ["#d97706", "#2563eb", "#7c3aed", "#16a34a", "#dc2626"];

const getStoreName = (s) => s?.storeName || process.env.STORE_NAME || "Showoff";
const getStoreEmail = (s) => s?.storeEmail || process.env.STORE_EMAIL || "";
const getStoreAddress = (s) => s?.storeAddress || process.env.STORE_ADDRESS || "";
const getSym = (s) => s?.currencySymbol || process.env.CurrencySymbol || "$";

const baseLayout = (content, settings) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${getStoreName(settings)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#111827;padding:24px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">${getStoreName(settings)}</h1>
          </td>
        </tr>
        <tr><td style="padding:32px;">${content}</td></tr>
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} ${getStoreName(settings)}. All rights reserved.</p>
            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">${getStoreAddress(settings)}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

const productRow = (item, sym) => `
<tr style="border-bottom:1px solid #e5e7eb;">
  <td style="padding:10px 8px;font-size:14px;color:#111827;">${item.product_name}${item.product_code ? ` <span style="color:#9ca3af;font-size:12px;">(${item.product_code})</span>` : ""}</td>
  <td style="padding:10px 8px;font-size:14px;color:#374151;text-align:center;">${item.product_quantity}</td>
  <td style="padding:10px 8px;font-size:14px;color:#374151;text-align:right;">${sym}${item.product_price.toFixed(2)}</td>
  <td style="padding:10px 8px;font-size:14px;font-weight:600;color:#111827;text-align:right;">${sym}${(item.product_price * item.product_quantity).toFixed(2)}</td>
</tr>`;

const totalRow = (label, value, bold = false, color = "") => `
<tr>
  <td colspan="3" style="padding:6px 8px;font-size:14px;color:#6b7280;text-align:right;">${label}</td>
  <td style="padding:6px 8px;font-size:14px;font-weight:${bold ? "700" : "400"};color:${color || (bold ? "#111827" : "#374151")};text-align:right;">${value}</td>
</tr>`;

exports.orderConfirmationEmail = (order, settings) => {
  const sym = getSym(settings);
  const email = getStoreEmail(settings);
  const name = getStoreName(settings);
  const rows = (order.products_list || []).map((item) => productRow(item, sym)).join("");

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Order Confirmed!</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Hi <strong>${order.receiver_name}</strong>, thank you for your order. We've received it and will process it soon.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
      <tr><td style="font-size:13px;color:#6b7280;">Order ID</td><td style="font-size:13px;font-weight:600;color:#111827;text-align:right;">${order.order_id}</td></tr>
      <tr><td style="font-size:13px;color:#6b7280;padding-top:8px;">Date</td><td style="font-size:13px;color:#374151;text-align:right;padding-top:8px;">${order.order_date || new Date().toLocaleDateString()}</td></tr>
      <tr><td style="font-size:13px;color:#6b7280;padding-top:8px;">Payment</td><td style="font-size:13px;color:#374151;text-align:right;padding-top:8px;">${order.payment_method || "—"}</td></tr>
      <tr><td style="font-size:13px;color:#6b7280;padding-top:8px;">Delivery</td><td style="font-size:13px;color:#374151;text-align:right;padding-top:8px;">${order.receiver_location || "—"}</td></tr>
    </table>

    <h3 style="margin:0 0 12px;font-size:15px;color:#111827;">Order Items</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:8px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:10px 8px;font-size:12px;color:#6b7280;text-align:left;font-weight:600;">PRODUCT</th>
          <th style="padding:10px 8px;font-size:12px;color:#6b7280;text-align:center;font-weight:600;">QTY</th>
          <th style="padding:10px 8px;font-size:12px;color:#6b7280;text-align:right;font-weight:600;">PRICE</th>
          <th style="padding:10px 8px;font-size:12px;color:#6b7280;text-align:right;font-weight:600;">TOTAL</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot style="background:#f9fafb;border-top:2px solid #e5e7eb;">
        ${totalRow("Subtotal", `${sym}${order.sub_total.toFixed(2)}`)}
        ${order.discount > 0 ? totalRow("Discount", `-${sym}${order.discount.toFixed(2)}`, false, "#16a34a") : ""}
        ${order.delivery_charge > 0 ? totalRow("Delivery Charge", `+${sym}${order.delivery_charge.toFixed(2)}`) : ""}
        ${totalRow("Total", `${sym}${order.total_bill.toFixed(2)}`, true)}
        ${order.total_due > 0 ? totalRow("Due Amount", `${sym}${order.total_due.toFixed(2)}`, false, "#dc2626") : ""}
      </tfoot>
    </table>

    ${email ? `<p style="margin:24px 0 0;font-size:14px;color:#6b7280;">If you have any questions, reply to this email or contact us at? <a href="mailto:${email}" style="color:#2563eb;">${email}</a></p>` : ""}
    <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">Thank you for shopping with <strong>${name}</strong>!</p>
  `;

  return {
    subject: `Order Confirmed — ${order.order_id} | ${name}`,
    html: baseLayout(content, settings),
  };
};

exports.orderStatusUpdateEmail = (order, newStatus, settings) => {
  const label = ORDER_STATUS_LABELS[newStatus] || "Updated";
  const color = ORDER_STATUS_COLORS[newStatus] || "#374151";
  const sym = getSym(settings);
  const email = getStoreEmail(settings);
  const name = getStoreName(settings);

  const messages = {
    1: "Your order is now being processed. We'll update you once it's shipped.",
    2: "Great news! Your order has been shipped and is on its way.",
    3: "Your order has been delivered. We hope you enjoy your purchase!",
    4: "Your order has been cancelled. If this was unexpected, please contact us.",
  };

  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Order Status Updated</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Hi <strong>${order.receiver_name}</strong>, your order status has been updated.</p>

    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:${color}1a;color:${color};border:1px solid ${color}33;padding:8px 24px;border-radius:999px;font-size:15px;font-weight:700;">${label}</span>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#374151;text-align:center;">${messages[newStatus] || "Your order status has been updated."}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:6px;padding:16px;margin-bottom:24px;">
      <tr><td style="font-size:13px;color:#6b7280;">Order ID</td><td style="font-size:13px;font-weight:600;color:#111827;text-align:right;">${order.order_id}</td></tr>
      <tr><td style="font-size:13px;color:#6b7280;padding-top:8px;">Total</td><td style="font-size:13px;font-weight:600;color:#111827;text-align:right;padding-top:8px;">${sym}${order.total_bill.toFixed(2)}</td></tr>
      <tr><td style="font-size:13px;color:#6b7280;padding-top:8px;">Delivery</td><td style="font-size:13px;color:#374151;text-align:right;padding-top:8px;">${order.receiver_location || "—"}</td></tr>
    </table>

    ${email ? `<p style="margin:0;font-size:14px;color:#6b7280;">Questions? <a href="mailto:${email}" style="color:#2563eb;">${email}</a></p>` : ""}
  `;

  return {
    subject: `Order ${label} — ${order.order_id} | ${name}`,
    html: baseLayout(content, settings),
  };
};
