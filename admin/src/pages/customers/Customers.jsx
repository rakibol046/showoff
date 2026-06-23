import { useState } from "react";
import { useGetCustomersQuery, useToggleCustomerStatusMutation } from "@/features/customers/customersApi";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import StatusBadge from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ToggleLeft } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function Customers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const params = { page, limit: 20 };
  if (debouncedSearch) params.search = debouncedSearch;

  const { data: result, isLoading } = useGetCustomersQuery(params);
  const customers = result?.data ?? [];
  const meta = result?.meta;

  const [toggleStatus, { isLoading: toggling }] = useToggleCustomerStatusMutation();

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" subtitle={`${meta?.total ?? 0} total customers`} />

      <div className="flex gap-3">
        <Input
          placeholder="Search by name, phone, email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-muted border-b">
              <tr>
                {["Name", "Phone", "Email", "Status", "Verified", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : (
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No customers found</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">{c.phone}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.email || "—"}</td>
                      <td className="px-4 py-3"><StatusBadge active={c.status} /></td>
                      <td className="px-4 py-3">
                        <StatusBadge active={c.isVerified} activeLabel="Verified" inactiveLabel="Unverified" />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatus(c._id)}
                          disabled={toggling}
                          title={c.status ? "Deactivate" : "Activate"}
                        >
                          <ToggleLeft className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.currentPage} of {meta.totalPages}
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
    </div>
  );
}
