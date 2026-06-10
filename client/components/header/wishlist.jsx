"use client";

import * as React from "react";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Wishlist() {
  const [goal, setGoal] = React.useState(350);

  function onClick(adjustment) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)));
  }

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <div>
          {/* <ShoppingCart /> */}
          <Heart />
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Wishlist</DrawerTitle>
            <DrawerDescription>Review your saved items.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            
          </div>
          <DrawerFooter>
            
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
