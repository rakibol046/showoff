"use client";

import * as React from "react";
import Link from "next/link";
import { fetchTopCategories } from "@/api/category.api";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function Menu() {
  const [categories, setCategories] = React.useState([]);
  React.useEffect(() => {
    const getCategories = async () => {
      const data = await fetchTopCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  if (!categories || categories.length === 0) {
    return (
      <>
        <div className="space-y-2 flex gap-4">
          <Skeleton className="h-6 w-25" />
          <Skeleton className="h-6 w-25" />
          <Skeleton className="h-6 w-25" />
          <Skeleton className="h-6 w-25" />
          <Skeleton className="h-6 w-25" />
        </div>
      </>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categories?.map((cat) => (
          <NavigationMenuItem key={cat._id}>
            <Link href={`/products?parentcat=${cat.name}`} passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <span className="font-bold">{cat.name}</span>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
