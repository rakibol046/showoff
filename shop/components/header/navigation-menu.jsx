"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Menu({ categories = [] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories.map((cat) => (
          <NavigationMenuItem key={cat._id}>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href={`/products?parentcat=${encodeURIComponent(cat.name)}`}>
                <span className="font-bold">{cat.name}</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
