import { useState } from "react";
import { imgUrl, onImgError } from "@/lib/imageUrl";
import { Link } from "react-router";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} from "@/features/products/productsApi";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Package, Search } from "lucide-react";
import useCurrency from "@/hooks/useCurrency";
import { useDebounce } from "@/hooks/useDebounce";
import PropTypes from "prop-types";

function StockBadge({ stock }) {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Out of stock</span>;
  if (stock <= 5)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" />{stock} left</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />{stock} in stock</span>;
}

StockBadge.propTypes = { stock: PropTypes.number.isRequired };

export default function Products() {
  const symbol = useCurrency();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const params = { page, limit: 15 };
  if (debouncedSearch) params.name = debouncedSearch;
  if (statusFilter !== "all") params.status = statusFilter;
  if (stockFilter !== "all") params.stock = stockFilter;

  const { data: result, isLoading, isFetching } = useGetProductsQuery(params);
  const products = result?.data ?? [];
  const meta = result?.meta;

  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [toggleStatus] = useToggleProductStatusMutation();

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        subtitle={`${meta?.total ?? 0} products`}
        actionLabel="Add Product"
        actionTo="/add-product"
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative sm:max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); resetPage(); }}>
          <SelectTrigger className="sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); resetPage(); }}>
          <SelectTrigger className="sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stock</SelectItem>
            <SelectItem value="in">In stock</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className={`border rounded-xl overflow-hidden transition-opacity duration-150 ${isFetching && !isLoading ? "opacity-60" : ""}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            <thead className="bg-muted/60 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-16">Image</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>

            {isLoading ? (
              <TableSkeleton rows={10} cols={7} />
            ) : (
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-muted-foreground">
                      <Package className="w-10 h-10 mx-auto mb-3 opacity-25" />
                      <p className="font-medium">No products found</p>
                      <p className="text-xs mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">

                      {/* Image */}
                      <td className="px-4 py-3">
                        {product.images?.[0] ? (
                          <img
                            src={imgUrl(product.images[0])}
                            alt={product.name}
                            onError={onImgError}
                            className="w-11 h-11 object-cover rounded-lg border shadow-sm"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-muted border flex items-center justify-center">
                            <Package className="w-5 h-5 text-muted-foreground/40" />
                          </div>
                        )}
                      </td>

                      {/* Name + slug */}
                      <td className="px-4 py-3 max-w-[220px]">
                        <p className="font-medium leading-snug truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate font-mono">/{product.slug}</p>
                      </td>

                      {/* Code */}
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                          {product.product_code || "—"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3">
                        <span className="font-semibold">{symbol}{product.sell_price}</span>
                        {product.regular_price > product.sell_price && (
                          <span className="block text-xs text-muted-foreground line-through">{symbol}{product.regular_price}</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3">
                        <StockBadge stock={product.stock ?? 0} />
                      </td>

                      {/* Status — click to toggle, same as color page */}
                      <td
                        className="px-4 py-3 cursor-pointer"
                        onClick={() => toggleStatus(product._id)}
                        title="Click to toggle status"
                      >
                        <StatusBadge active={product.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Link to={`/products/${product._id}/edit`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setDeleteId(product._id)}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
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
        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted-foreground">
            Showing {(meta.currentPage - 1) * meta.limit + 1}–{Math.min(meta.currentPage * meta.limit, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p - 1)} disabled={!meta.hasPrevPage}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <span className="text-sm text-muted-foreground px-1">{meta.currentPage} / {meta.totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => p + 1)} disabled={!meta.hasNextPage}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={async () => { await deleteProduct(deleteId); setDeleteId(null); }}
        loading={deleting}
        title="Delete product?"
        description="This will permanently delete the product and cannot be undone."
      />
    </div>
  );
}
