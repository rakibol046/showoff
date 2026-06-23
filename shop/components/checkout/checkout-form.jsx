"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useCart from "@/hooks/useCart";
import { clearCart } from "@/store/cartStore";
import { placeOrder } from "@/api/order.api";
import { symbol } from "@/lib/currency";
const IMG_BASE = (process.env.NEXT_PUBLIC_API_IMAGE_URL || "").replace(/\/$/, "");
const IMG_FALLBACK = "/images/default-product.webp";
function getImgSrc(path) {
  if (!path) return IMG_FALLBACK;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return IMG_BASE ? `${IMG_BASE}/${path.replace(/^\//, "")}` : IMG_FALLBACK;
}
import { AUTH_TOKEN_KEY, DEFAULT_DELIVERY_CHARGE, EXPRESS_DELIVERY_CHARGE } from "@/lib/constants";
import { fetchSettings } from "@/api/settings.api";

export default function CheckoutForm() {
  const { cart, total } = useCart();
  const [form, setForm] = useState({
    receiver_name: "",
    receiver_phone: "",
    receiver_email: "",
    receiver_location: "",
    payment_method: "cod",
    delivery_type: "standard",
  });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState({
    standard: DEFAULT_DELIVERY_CHARGE,
    express: EXPRESS_DELIVERY_CHARGE,
  });

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        if (s?.standard_delivery_charge || s?.express_delivery_charge) {
          setDeliveryCharges({
            standard: s.standard_delivery_charge ?? DEFAULT_DELIVERY_CHARGE,
            express: s.express_delivery_charge ?? EXPRESS_DELIVERY_CHARGE,
          });
        }
      })
      .catch(() => {});
  }, []);

  const DELIVERY_CHARGE = form.delivery_type === "express" ? deliveryCharges.express : deliveryCharges.standard;

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
      const products = cart.map((item) => ({
        product_id: item._id,
        quantity: item.quantity,
      }));
      const result = await placeOrder(
        { ...form, products, delivery_charge: DELIVERY_CHARGE },
        token
      );
      clearCart();
      setOrderId(result._id || result.id || "done");
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
        <p className="text-muted-foreground mb-6">
          Your order has been placed successfully. We will contact you shortly.
        </p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Your cart is empty.</p>
        <Link href="/products">
          <Button>Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
      {/* Contact & Delivery */}
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">Delivery Information</h2>

        <div className="space-y-1">
          <Label htmlFor="receiver_name">Full Name *</Label>
          <Input id="receiver_name" name="receiver_name" required value={form.receiver_name} onChange={handleChange} placeholder="Your full name" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="receiver_phone">Phone Number *</Label>
          <Input id="receiver_phone" name="receiver_phone" required value={form.receiver_phone} onChange={handleChange} placeholder="01XXXXXXXXX" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="receiver_email">Email (optional)</Label>
          <Input id="receiver_email" name="receiver_email" type="email" value={form.receiver_email} onChange={handleChange} placeholder="For order confirmation" />
        </div>

        <div className="space-y-1">
          <Label htmlFor="receiver_location">Delivery Address *</Label>
          <Input id="receiver_location" name="receiver_location" required value={form.receiver_location} onChange={handleChange} placeholder="House, Road, Area, City" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Payment Method</Label>
            <Select value={form.payment_method} onValueChange={(v) => setForm((p) => ({ ...p, payment_method: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="bkash">bKash</SelectItem>
                <SelectItem value="nagad">Nagad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Delivery Type</Label>
            <Select value={form.delivery_type} onValueChange={(v) => setForm((p) => ({ ...p, delivery_type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard ({symbol}{deliveryCharges.standard})</SelectItem>
                <SelectItem value="express">Express ({symbol}{deliveryCharges.express})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && <p role="alert" aria-live="assertive" className="text-sm text-red-500 border border-red-200 bg-red-50 rounded p-3">{error}</p>}
      </div>

      {/* Order Summary */}
      <div className="space-y-5">
        <h2 className="text-xl font-semibold">Order Summary</h2>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-3 items-start border-b pb-3">
              <div className="w-16 h-16 relative shrink-0 rounded overflow-hidden border bg-muted">
                <Image
                  src={getImgSrc(item.image)}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                  onError={(e) => { if (!e.currentTarget.dataset.errored) { e.currentTarget.dataset.errored = "1"; e.currentTarget.src = IMG_FALLBACK; } }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                {item.color && <p className="text-xs text-muted-foreground">Color: {item.color}</p>}
                {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                <p className="text-sm font-semibold">
                  {symbol}{(item.sell_price * item.quantity).toFixed(2)}{" "}
                  <span className="font-normal text-muted-foreground text-xs">× {item.quantity}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex justify-between"><span>Subtotal</span><span>{symbol}{total.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Delivery</span><span>{symbol}{DELIVERY_CHARGE}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total</span>
            <span>{symbol}{(total + DELIVERY_CHARGE).toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order"}
        </Button>
      </div>
    </form>
  );
}
