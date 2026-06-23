import { useGetOrderQuery } from "@/features/orders/ordersApi";
import { useGetSettingsQuery } from "@/features/settings/settingsApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const ORDER_STATUS_LABELS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_STATUS_LABELS = ["Unpaid", "Paid", "Partial"];

function generateInvoiceHTML(order, settings) {
  const sym = settings?.currencySymbol ?? "$";
  const storeName = settings?.storeName ?? "Showoff";
  const storeEmail = settings?.storeEmail ?? "";
  const storeAddress = settings?.storeAddress ?? "";
  const currency = settings?.currency ?? "USD";

  const rows = (order.products_list || []).map((item) => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#111827;">
        ${item.product_name}
        ${item.product_code ? `<br/><span style="font-size:11px;color:#9ca3af;">${item.product_code}</span>` : ""}
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:center;color:#374151;">${item.product_quantity}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;color:#374151;">${sym}${Number(item.product_price).toFixed(2)}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;text-align:right;font-weight:600;color:#111827;">${sym}${(item.product_price * item.product_quantity).toFixed(2)}</td>
    </tr>`).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${order.order_id}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Helvetica Neue',Arial,sans-serif; color:#111827; background:#fff; padding:40px; }
    .page { max-width:800px; margin:0 auto; }
    @media print {
      body { padding:20px; }
      .no-print { display:none !important; }
      @page { size:A4; margin:15mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
      <tr>
        <td>
          <h1 style="font-size:26px;font-weight:800;color:#111827;letter-spacing:1px;">${storeName}</h1>
          ${storeAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;">${storeAddress}</p>` : ""}
          ${storeEmail ? `<p style="font-size:12px;color:#6b7280;">${storeEmail}</p>` : ""}
        </td>
        <td style="text-align:right;">
          <div style="display:inline-block;background:#111827;color:#fff;padding:8px 20px;border-radius:4px;font-size:22px;font-weight:700;letter-spacing:2px;">INVOICE</div>
          <p style="font-size:12px;color:#6b7280;margin-top:8px;">Invoice No: <strong style="color:#111827;">${order.order_id}</strong></p>
          <p style="font-size:12px;color:#6b7280;margin-top:2px;">Date: <strong style="color:#111827;">${order.order_date || new Date(order.createdAt).toLocaleDateString()}</strong></p>
          <p style="font-size:12px;color:#6b7280;margin-top:2px;">Currency: <strong style="color:#111827;">${currency}</strong></p>
        </td>
      </tr>
    </table>

    <!-- Bill To / Order Info -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td width="50%" style="vertical-align:top;">
          <div style="background:#f9fafb;border-radius:6px;padding:16px;">
            <p style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">BILL TO</p>
            <p style="font-size:14px;font-weight:700;color:#111827;">${order.receiver_name || order.customer_id?.name || "—"}</p>
            ${order.receiver_phone ? `<p style="font-size:13px;color:#374151;margin-top:4px;">📞 ${order.receiver_phone}</p>` : ""}
            ${order.receiver_email ? `<p style="font-size:13px;color:#374151;margin-top:4px;">✉ ${order.receiver_email}</p>` : ""}
            ${order.receiver_location ? `<p style="font-size:13px;color:#374151;margin-top:4px;">📍 ${order.receiver_location}</p>` : ""}
          </div>
        </td>
        <td width="8%"></td>
        <td width="42%" style="vertical-align:top;">
          <div style="background:#f9fafb;border-radius:6px;padding:16px;">
            <p style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">ORDER DETAILS</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="font-size:13px;color:#6b7280;padding-bottom:6px;">Payment Method</td><td style="font-size:13px;color:#111827;text-align:right;padding-bottom:6px;text-transform:capitalize;">${order.payment_method || "—"}</td></tr>
              <tr><td style="font-size:13px;color:#6b7280;padding-bottom:6px;">Payment Status</td><td style="font-size:13px;color:#111827;text-align:right;padding-bottom:6px;">${PAYMENT_STATUS_LABELS[order.payment_status] ?? "—"}</td></tr>
              <tr><td style="font-size:13px;color:#6b7280;padding-bottom:6px;">Order Status</td><td style="font-size:13px;color:#111827;text-align:right;padding-bottom:6px;">${ORDER_STATUS_LABELS[order.order_status] ?? "—"}</td></tr>
              <tr><td style="font-size:13px;color:#6b7280;">Delivery Type</td><td style="font-size:13px;color:#111827;text-align:right;text-transform:capitalize;">${order.delivery_type || "—"}</td></tr>
            </table>
          </div>
        </td>
      </tr>
    </table>

    <!-- Products Table -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;margin-bottom:20px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:12px;font-size:11px;font-weight:700;color:#6b7280;text-align:left;letter-spacing:1px;text-transform:uppercase;">PRODUCT</th>
          <th style="padding:12px;font-size:11px;font-weight:700;color:#6b7280;text-align:center;letter-spacing:1px;text-transform:uppercase;">QTY</th>
          <th style="padding:12px;font-size:11px;font-weight:700;color:#6b7280;text-align:right;letter-spacing:1px;text-transform:uppercase;">UNIT PRICE</th>
          <th style="padding:12px;font-size:11px;font-weight:700;color:#6b7280;text-align:right;letter-spacing:1px;text-transform:uppercase;">AMOUNT</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <!-- Totals -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
      <tr>
        <td width="55%"></td>
        <td width="45%">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:6px;padding:16px;">
            <tr><td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Subtotal</td><td style="font-size:13px;color:#374151;text-align:right;padding-bottom:8px;">${sym}${Number(order.sub_total).toFixed(2)}</td></tr>
            ${Number(order.discount) > 0 ? `<tr><td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Discount</td><td style="font-size:13px;color:#16a34a;text-align:right;padding-bottom:8px;">-${sym}${Number(order.discount).toFixed(2)}</td></tr>` : ""}
            ${Number(order.delivery_charge) > 0 ? `<tr><td style="font-size:13px;color:#6b7280;padding-bottom:8px;">Delivery Charge</td><td style="font-size:13px;color:#374151;text-align:right;padding-bottom:8px;">+${sym}${Number(order.delivery_charge).toFixed(2)}</td></tr>` : ""}
            <tr style="border-top:2px solid #e5e7eb;">
              <td style="font-size:15px;font-weight:700;color:#111827;padding-top:10px;">Total</td>
              <td style="font-size:15px;font-weight:700;color:#111827;text-align:right;padding-top:10px;">${sym}${Number(order.total_bill).toFixed(2)}</td>
            </tr>
            ${Number(order.total_payment) > 0 ? `<tr><td style="font-size:13px;color:#6b7280;padding-top:8px;">Amount Paid</td><td style="font-size:13px;color:#16a34a;text-align:right;padding-top:8px;">${sym}${Number(order.total_payment).toFixed(2)}</td></tr>` : ""}
            ${Number(order.total_due) > 0 ? `<tr><td style="font-size:13px;font-weight:600;color:#dc2626;padding-top:4px;">Due Amount</td><td style="font-size:13px;font-weight:600;color:#dc2626;text-align:right;padding-top:4px;">${sym}${Number(order.total_due).toFixed(2)}</td></tr>` : ""}
          </table>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <div style="border-top:2px solid #e5e7eb;padding-top:20px;text-align:center;">
      <p style="font-size:14px;font-weight:600;color:#374151;">Thank you for your order!</p>
      <p style="font-size:12px;color:#9ca3af;margin-top:4px;">This is a computer-generated invoice and does not require a signature.</p>
      ${storeEmail ? `<p style="font-size:12px;color:#9ca3af;margin-top:4px;">For queries: ${storeEmail}</p>` : ""}
    </div>

    <!-- Print Button (hidden when printing) -->
    <div class="no-print" style="text-align:center;margin-top:32px;">
      <button onclick="window.print()" style="background:#111827;color:#fff;border:none;padding:12px 32px;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer;">
        🖨️ Print / Save as PDF
      </button>
    </div>
  </div>
</body>
</html>`;
}

export default function InvoiceModal({ id, open, onOpenChange }) {
  const { data: order, isLoading } = useGetOrderQuery(id, { skip: !id || !open });
  const { data: settings } = useGetSettingsQuery();

  const sym = settings?.currencySymbol ?? "$";

  const handlePrint = () => {
    if (!order) return;
    const html = generateInvoiceHTML(order, settings);
    const win = window.open("", "_blank", "width=900,height=750");
    win.document.write(html);
    win.document.close();
    win.focus();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle>Invoice Preview</DialogTitle>
            <Button size="sm" onClick={handlePrint} disabled={isLoading || !order} className="gap-2">
              <Printer className="w-4 h-4" />
              Print / Download PDF
            </Button>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : order ? (
          <div className="border rounded-lg overflow-hidden bg-white text-sm">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">{settings?.storeName ?? "Showoff"}</h2>
                {settings?.storeAddress && <p className="text-xs text-muted-foreground mt-1">{settings.storeAddress}</p>}
                {settings?.storeEmail && <p className="text-xs text-muted-foreground">{settings.storeEmail}</p>}
              </div>
              <div className="text-right">
                <div className="inline-block bg-foreground text-background px-4 py-1.5 rounded font-bold text-lg tracking-widest">INVOICE</div>
                <p className="text-xs text-muted-foreground mt-2">No: <strong className="text-foreground">{order.order_id}</strong></p>
                <p className="text-xs text-muted-foreground">Date: <strong className="text-foreground">{order.order_date || new Date(order.createdAt).toLocaleDateString()}</strong></p>
              </div>
            </div>

            {/* Bill To + Order Info */}
            <div className="grid grid-cols-2 gap-4 p-6 border-b">
              <div className="bg-muted/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Bill To</p>
                <p className="font-bold">{order.receiver_name || order.customer_id?.name || "—"}</p>
                {order.receiver_phone && <p className="text-muted-foreground text-xs mt-1">📞 {order.receiver_phone}</p>}
                {order.receiver_email && <p className="text-muted-foreground text-xs mt-0.5">✉ {order.receiver_email}</p>}
                {order.receiver_location && <p className="text-muted-foreground text-xs mt-0.5">📍 {order.receiver_location}</p>}
              </div>
              <div className="bg-muted/40 rounded-lg p-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Order Details</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="capitalize">{order.payment_method || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment Status</span><span>{["Unpaid", "Paid", "Partial"][order.payment_status] ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Order Status</span><span>{["Pending","Processing","Shipped","Delivered","Cancelled"][order.order_status] ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="capitalize">{order.delivery_type || "—"}</span></div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="p-6 border-b">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/60">
                    {["Product", "Qty", "Unit Price", "Amount"].map((h) => (
                      <th key={h} className={`py-2.5 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest ${h !== "Product" ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(order.products_list || []).map((item, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-3">
                        <p className="font-medium">{item.product_name}</p>
                        {item.product_code && <p className="text-xs text-muted-foreground">{item.product_code}</p>}
                      </td>
                      <td className="px-3 py-3 text-center text-muted-foreground">{item.product_quantity}</td>
                      <td className="px-3 py-3 text-right text-muted-foreground">{sym}{Number(item.product_price).toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-semibold">{sym}{(item.product_price * item.product_quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end p-6">
              <div className="w-56 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{sym}{Number(order.sub_total).toFixed(2)}</span></div>
                {Number(order.discount) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="text-green-600">-{sym}{Number(order.discount).toFixed(2)}</span></div>}
                {Number(order.delivery_charge) > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>+{sym}{Number(order.delivery_charge).toFixed(2)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t pt-2"><span>Total</span><span>{sym}{Number(order.total_bill).toFixed(2)}</span></div>
                {Number(order.total_payment) > 0 && <div className="flex justify-between text-green-600"><span>Paid</span><span>{sym}{Number(order.total_payment).toFixed(2)}</span></div>}
                {Number(order.total_due) > 0 && <div className="flex justify-between text-red-600 font-semibold"><span>Due</span><span>{sym}{Number(order.total_due).toFixed(2)}</span></div>}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t p-4">
              <p className="text-sm font-medium">Thank you for your order!</p>
              <p className="text-xs text-muted-foreground mt-1">Computer-generated invoice — no signature required.</p>
            </div>
          </div>
        ) : (
          <p className="py-8 text-center text-muted-foreground">Order not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
