"use client";

import { useEffect, useMemo, useState } from "react";
import { useGetProductsQuery } from "../../features/products/productsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

const Products = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState("all");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [deleteProductId, setDeleteProductId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products || [];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStock !== "all") {
      result = result.filter((p) =>
        filterStock === "in" ? p.stock > 0 : p.stock === 0
      );
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
      });
    }

    return result;
  }, [products, search, filterStock, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / perPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <main className="">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Product List</CardTitle>
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select onValueChange={setFilterStock} defaultValue="all">
              <SelectTrigger className="w-40">
                <span>
                  {filterStock === "all"
                    ? "All Stock"
                    : filterStock === "in"
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="w-full h-48" />
          ) : error ? (
            <p className="text-red-500">Error loading products!</p>
          ) : (
            <ScrollArea className="w-full overflow-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      Product Name
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("product_code")}
                    >
                      Code
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("sell_price")}
                    >
                      Sell Price
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("stock")}
                    >
                      Stock
                    </TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.product_code}</TableCell>
                      <TableCell>৳{product.sell_price}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="secondary" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      setDeleteProductId(product._id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <p className="mb-4">
                                    Are you sure you want to delete this
                                    product?
                                  </p>
                                  <DialogFooter>
                                    <Button
                                      variant="ghost"
                                      onClick={() => setDeleteProductId(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        console.log(
                                          "Delete product id:",
                                          deleteProductId
                                        );
                                        setDeleteProductId(null);
                                      }}
                                    >
                                      Confirm
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <p>
                  Page {currentPage} of {totalPages}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default Products;
