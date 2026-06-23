import { useState } from "react";
import { useNavigate } from "react-router";
import useCurrency from "@/hooks/useCurrency";
import { useGetOrdersQuery, useUpdateOrderStatusMutation, useUpdatePaymentStatusMutation } from "@/features/orders/ordersApi";
import { useGetOrderQuery } from "@/features/orders/ordersApi";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import StatusBadge from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import InvoiceModal from "./InvoiceModal";
import { useDebounce } from "@/hooks/useDebounce";

const ORDER_STATUSES = [
  { value: "0", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "1", label: "Processing", color: "bg-blue-100 text-blue-800" },
  { value: "2", label: "Shipped", color: "bg-purple-100 text-purple-800" },
  { value: "3", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "4", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

const PAYMENT_STATUSES = [
  { value: "0", label: "Unpaid", color: "bg-red-100 text-red-800" },
  { value: "1", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "2", label: "Partial", color: "bg-yellow-100 text-yellow-800" },
];

function OrderBadge({ value, options }) {
  const opt = options.find((o) => o.value === String(value));
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${opt?.color || "bg-gray-100 text-gray-700"}`}>
      {opt?.label || "Unknown"}
    </span>
  );
}

function OrderDetailModal({ id, open, onOpenChange }) {
  const { data: order, isLoading } = useGetOrderQuery(id, { skip: !id || !open });
  const [updateStatus, { isLoading: updatingStatus }] = useUpdateOrderStatusMutation();
  const [updatePayment, { isLoading: updatingPayment }] = useUpdatePaymentStatusMutation();
  const symbol = useCurrency();

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Order ID</p>
                <p className="font-mono font-medium">{order.order_id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{order.order_date || new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Customer</p>
                <p>{order.customer_id?.name || order.receiver_name || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p>{order.customer_id?.phone || order.receiver_phone || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p>{order.receiver_location || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Payment Method</p>
                <p>{order.payment_method || "—"}</p>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold mb-3">Products</h3>
              <div className="space-y-2">
                {order.products_list?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg text-sm">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-muted-foreground">Qty: {item.product_quantity} × ${item.product_price}</p>
                    </div>
                    <p className="font-bold">{symbol}{(item.product_price * item.product_quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{symbol}{order.sub_total}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>-{symbol}{order.discount}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{symbol}{order.delivery_charge}</span></div>
                <div className="flex justify-between font-bold text-base pt-1 border-t"><span>Total</span><span>{symbol}{order.total_bill}</span></div>
              </div>
            </div>

            {/* Status controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Order Status</label>
                <Select
                  defaultValue={String(order.order_status)}
                  onValueChange={(v) => updateStatus({ id: order._id, order_status: parseInt(v) })}
                  disabled={updatingStatus}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Payment Status</label>
                <Select
                  defaultValue={String(order.payment_status)}
                  onValueChange={(v) => updatePayment({ id: order._id, payment_status: parseInt(v) })}
                  disabled={updatingPayment}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground py-4">Order not found</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const symbol = useCurrency();
  const [page, setPage] = useState(1);
  const [invoiceOrderId, setInvoiceOrderId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const params = { page, limit: 20 };
  if (debouncedSearch) params.search = debouncedSearch;
  if (statusFilter) params.status = statusFilter;

  const { data: result, isLoading } = useGetOrdersQuery(params);
  const orders = result?.data ?? [];
  const meta = result?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage all customer orders"
        actionLabel="Create Order"
        onAction={() => navigate("/orders/create")}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by order ID, name, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="sm:max-w-xs"
        />
        <Select
          value={statusFilter}
          onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-muted border-b">
              <tr>
                {["Order ID", "Customer", "Total", "Order Status", "Payment", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : (
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No orders found</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{order.order_id}</td>
                      <td className="px-4 py-3">{order.customer_id?.name || order.receiver_name || "—"}</td>
                      <td className="px-4 py-3 font-medium">{symbol}{order.total_bill}</td>
                      <td className="px-4 py-3"><OrderBadge value={order.order_status} options={ORDER_STATUSES} /></td>
                      <td className="px-4 py-3"><OrderBadge value={order.payment_status} options={PAYMENT_STATUSES} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{order.order_date || new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" title="View Details" onClick={() => setSelectedOrderId(order._id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Print Invoice" onClick={() => setInvoiceOrderId(order._id)}>
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.currentPage} of {meta.totalPages} ({meta.total} orders)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={!meta.hasPrevPage}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!meta.hasNextPage}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <OrderDetailModal
        id={selectedOrderId}
        open={!!selectedOrderId}
        onOpenChange={(v) => !v && setSelectedOrderId(null)}
      />

      <InvoiceModal
        id={invoiceOrderId}
        open={!!invoiceOrderId}
        onOpenChange={(v) => !v && setInvoiceOrderId(null)}
      />
    </div>
  );
}
