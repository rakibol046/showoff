"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer, DrawerClose, DrawerContent, DrawerFooter,
  DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";
import useCart from "@/hooks/useCart";
import { symbol } from "@/lib/currency";
import { getImgSrc } from "@/lib/imageUrl";
export default function Cart() {
  const { cart, count, total, removeFromCart, updateQty } = useCart();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="relative" aria-label="Cart">
          <ShoppingCart className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle>Cart ({count})</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.key} className="flex gap-3 items-start border-b pb-3">
                <div className="w-16 h-16 relative shrink-0 rounded overflow-hidden border bg-muted">
                  <Image
                    src={getImgSrc(item.image)}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    onError={(e) => { if (!e.currentTarget.dataset.errored) { e.currentTarget.dataset.errored = "1"; e.currentTarget.src = getImgSrc(null); } }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  {item.color && <p className="text-xs text-muted-foreground">Color: {item.color}</p>}
                  {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                  <p className="text-sm font-semibold mt-1">{symbol}{(item.sell_price * item.quantity).toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQty(item.key, item.quantity - 1)} className="p-0.5 rounded border hover:bg-muted">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.key, item.quantity + 1)} className="p-0.5 rounded border hover:bg-muted">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.key)} className="text-muted-foreground hover:text-red-500 shrink-0 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <DrawerFooter className="border-t">
          {cart.length > 0 && (
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Subtotal</span>
              <span>{symbol}{total.toFixed(2)}</span>
            </div>
          )}
          <DrawerClose asChild>
            <Link href="/checkout">
              <Button className="w-full" disabled={cart.length === 0}>Checkout</Button>
            </Link>
          </DrawerClose>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Continue Shopping</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
