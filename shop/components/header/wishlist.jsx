"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer, DrawerClose, DrawerContent, DrawerFooter,
  DrawerHeader, DrawerTitle, DrawerTrigger,
} from "@/components/ui/drawer";
import useWishlist from "@/hooks/useWishlist";
import { symbol } from "@/lib/currency";

import { getImgSrc } from "@/lib/imageUrl";

export default function Wishlist() {
  const { wishlist, count, removeFromWishlist } = useWishlist();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <button className="relative" aria-label="Wishlist">
          <Heart className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle>Wishlist ({count})</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {wishlist.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">Your wishlist is empty.</p>
          ) : (
            wishlist.map((item) => (
              <div key={item._id} className="flex gap-3 items-start border-b pb-3">
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
                  <p className="text-sm font-semibold mt-1">{symbol}{item.sell_price?.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromWishlist(item._id)} className="text-muted-foreground hover:text-red-500 shrink-0 mt-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <DrawerFooter className="border-t">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
