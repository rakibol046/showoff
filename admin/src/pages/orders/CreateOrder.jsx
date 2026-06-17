import { useState, useMemo } from "react";
import { imgUrl, onImgError } from "@/lib/imageUrl";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useGetProductsQuery } from "@/features/products/productsApi";
import { useCreateOrderMutation } from "@/features/orders/ordersApi";
import useCurrency from "@/hooks/useCurrency";
import PageHeader from "@/components/common/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Search, Package } from "lucide-react";

const ORDER_STATUSES = [
  { value: "0", label: "Pending" },
  { value: "1", label: "Processing" },
  { value: "2", label: "Shipped" },
  { value: "3", label: "Delivered" },
  { value: "4", label: "Cancelled" },
];

const PAYMENT_METHODS = ["cash", "card", "online", "bank_transfer"];
const PAYMENT_STATUSES = [
  { value: "0", label: "Unpaid" },
  { value: "1", label: "Paid" },
  { value: "2", label: "Partial" },
];
const DELIVERY_TYPES = ["home", "pickup", "courier"];

export default function CreateOrder() {
  const navigate = useNavigate();
  const symbol = useCurrency();
  const [createOrder, { isLoading: submitting }] = useCreateOrderMutation();

  // Product search state
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: searchResult } = useGetProductsQuery(
    { name: search, limit: 8 },
    { skip: !search }
  );
  const searchProducts = searchResult?.data ?? [];

  // Selected products in cart
  const [cart, setCart] = useState([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      order_status: "0",
      payment_method: "cash",
      payment_status: "0",
      delivery_type: "home",
      delivery_charge: 0,
      discount: 0,
      total_payment: 0,
    },
  });

  const deliveryCharge = parseFloat(watch("delivery_charge")) || 0;
  const discount = parseFloat(watch("discount")) || 0;
  const totalPayment = parseFloat(watch("total_payment")) || 0;

  const subTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.sell_price * item.qty, 0),
    [cart]
  );
  const totalBill = Math.max(subTotal + deliveryCharge - discount, 0);
  const totalDue = Math.max(totalBill - totalPayment, 0);

  const addProduct = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setSearchInput("");
    setSearch("");
  };

  const updateQty = (id, qty) => {
    const n = parseInt(qty);
    if (n < 1) return;
    setCart((prev) => prev.map((p) => (p._id === id ? { ...p, qty: n } : p)));
  };

  const removeProduct = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const onSubmit = async (data) => {
    if (!cart.length) return;

    const result = await createOrder({
      receiver_name: data.receiver_name,
      receiver_phone: data.receiver_phone,
      receiver_email: data.receiver_email || undefined,
      receiver_location: data.receiver_location,
      products: cart.map((p) => ({ product_id: p._id, quantity: p.qty })),
      discount: parseFloat(data.discount) || 0,
      delivery_charge: parseFloat(data.delivery_charge) || 0,
      payment_method: data.payment_method,
      payment_status: parseInt(data.payment_status),
      delivery_type: data.delivery_type,
      order_status: parseInt(data.order_status),
      total_payment: parseFloat(data.total_payment) || 0,
    });

    if (!result.error) {
      navigate("/orders");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Create Order" subtitle="Manually create an order for a customer" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Receiver Info */}
        <div className="border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Receiver Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input
                className="mt-1"
                placeholder="Receiver full name"
                {...register("receiver_name", { required: "Receiver name is required" })}
              />
              {errors.receiver_name && (
                <p className="text-xs text-red-500 mt-1">{errors.receiver_name.message}</p>
              )}
            </div>
            <div>
              <Label>Phone *</Label>
              <Input
                className="mt-1"
                placeholder="+8801XXXXXXXXX"
                {...register("receiver_phone", { required: "Phone number is required" })}
              />
              {errors.receiver_phone && (
                <p className="text-xs text-red-500 mt-1">{errors.receiver_phone.message}</p>
              )}
            </div>
            <div>
              <Label>Email <span className="text-muted-foreground font-normal">(optional — for order confirmation)</span></Label>
              <Input
                className="mt-1"
                type="email"
                placeholder="customer@example.com"
                {...register("receiver_email", {
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                })}
              />
              {errors.receiver_email && (
                <p className="text-xs text-red-500 mt-1">{errors.receiver_email.message}</p>
              )}
            </div>
            <div>
              <Label>Delivery Address</Label>
              <Input className="mt-1" placeholder="Full address" {...register("receiver_location")} />
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Products
          </h2>

          {/* Search */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search product by name..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>

            {searchProducts.length > 0 && searchInput && (
              <div className="absolute z-10 top-full mt-1 w-full bg-background border rounded-lg shadow-lg overflow-hidden max-h-56 overflow-y-auto">
                {searchProducts.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted text-left transition-colors"
                  >
                    {product.images?.[0] ? (
                      <img
                        src={imgUrl(product.images[0])}
                        alt={product.name}
                        onError={onImgError}
                        className="w-8 h-8 object-cover rounded border shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded border bg-muted flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {symbol}{product.sell_price} · Stock: {product.stock}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart table */}
          {cart.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/60 border-b">
                  <tr>
                    {["Product", "Unit Price", "Qty", "Total", ""].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left font-medium text-muted-foreground text-xs">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id} className="border-b last:border-0">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {item.images?.[0] ? (
                            <img
                              src={imgUrl(item.images[0])}
                              alt={item.name}
                              onError={onImgError}
                              className="w-8 h-8 object-cover rounded border shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded border bg-muted shrink-0" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{symbol}{item.sell_price}</td>
                      <td className="px-3 py-3">
                        <Input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateQty(item._id, e.target.value)}
                          className="w-16 h-8 text-center"
                        />
                      </td>
                      <td className="px-3 py-3 font-medium">
                        {symbol}{(item.sell_price * item.qty).toFixed(2)}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => removeProduct(item._id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg py-10 text-center text-muted-foreground text-sm">
              Search and add products to the order
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Order Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Order Status</Label>
              <Select
                value={watch("order_status")}
                onValueChange={(v) => setValue("order_status", v)}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select
                value={watch("payment_method")}
                onValueChange={(v) => setValue("payment_method", v)}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>{m.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment Status</Label>
              <Select
                value={watch("payment_status")}
                onValueChange={(v) => setValue("payment_status", v)}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery Type</Label>
              <Select
                value={watch("delivery_type")}
                onValueChange={(v) => setValue("delivery_type", v)}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DELIVERY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t.replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Delivery Charge ({symbol})</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                className="mt-1"
                {...register("delivery_charge", { min: 0 })}
              />
            </div>
            <div>
              <Label>Discount ({symbol})</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                className="mt-1"
                {...register("discount", { min: 0 })}
              />
            </div>
            <div>
              <Label>Amount Paid ({symbol})</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                className="mt-1"
                {...register("total_payment", { min: 0 })}
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-xl p-5">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{symbol}{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span>+{symbol}{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-green-600">-{symbol}{discount.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total Bill</span>
              <span>{symbol}{totalBill.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="text-green-600">-{symbol}{totalPayment.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-red-600">
              <span>Due Amount</span>
              <span>{symbol}{totalDue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={submitting || !cart.length} className="flex-1 sm:flex-none sm:w-40">
            {submitting ? "Creating..." : "Create Order"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/orders")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
