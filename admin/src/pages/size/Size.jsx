import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetSizesQuery, useCreateSizeMutation, useUpdateSizeMutation,
  useToggleSizeStatusMutation, useDeleteSizeMutation, useBulkDeleteSizesMutation,
} from "@/features/sizes/sizesApi";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

function SizeFormDialog({ open, onOpenChange, editData }) {
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: editData
      ? {
          name: editData.name,
          label: editData.label || "",
          chest: editData.measurements?.chest ?? "",
          waist: editData.measurements?.waist ?? "",
          length: editData.measurements?.length ?? "",
          status: editData.status,
        }
      : { name: "", label: "", chest: "", waist: "", length: "", status: true },
  });

  const [createSize, { isLoading: creating }] = useCreateSizeMutation();
  const [updateSize, { isLoading: updating }] = useUpdateSizeMutation();
  const saving = creating || updating;

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      label: data.label,
      status: data.status,
      measurements: {
        chest: data.chest !== "" ? Number(data.chest) : undefined,
        waist: data.waist !== "" ? Number(data.waist) : undefined,
        length: data.length !== "" ? Number(data.length) : undefined,
      },
    };
    const result = editData
      ? await updateSize({ id: editData._id, ...payload })
      : await createSize(payload);
    if (!result.error) { onOpenChange(false); reset(); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Size" : "Add Size"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Size Name *</Label>
            <Input className="mt-1" placeholder="e.g. XL" {...register("name", { required: true })} />
          </div>
          <div>
            <Label>Label</Label>
            <Input className="mt-1" placeholder="e.g. Extra Large" {...register("label")} />
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Measurements (cm)</p>
            <div className="grid grid-cols-3 gap-3">
              {["chest", "waist", "length"].map((k) => (
                <div key={k}>
                  <Label className="capitalize">{k}</Label>
                  <Input type="number" min="0" className="mt-1" placeholder="—" {...register(k)} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={!!watch("status")} onCheckedChange={(v) => setValue("status", v)} />
            <Label>Active</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : editData ? "Save Changes" : "Add Size"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SizeManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const params = {};
  if (statusFilter !== "all") params.status = statusFilter;
  const { data: sizes = [], isLoading } = useGetSizesQuery(params);

  const [toggleStatus] = useToggleSizeStatusMutation();
  const [deleteSize, { isLoading: deleting }] = useDeleteSizeMutation();
  const [bulkDelete, { isLoading: bulkDeleting }] = useBulkDeleteSizesMutation();

  const sizeList = Array.isArray(sizes) ? sizes : [];
  const filtered = sizeList.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.label || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => setSelected((prev) => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((s) => s._id)));

  const openAdd = () => { setEditData(null); setDialogOpen(true); };
  const openEdit = (s) => { setEditData(s); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <PageHeader title="Sizes" subtitle={`${sizeList.length} sizes total`} actionLabel="Add Size" onAction={openAdd} />

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search sizes..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)}>
            Delete {selected.size} selected
          </Button>
        )}
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="cursor-pointer" />
                </th>
                {["Name", "Label", "Chest", "Waist", "Length", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton rows={8} cols={8} />
            ) : (
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-muted-foreground">No sizes found</td></tr>
                ) : (
                  filtered.map((size) => (
                    <tr key={size._id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(size._id)} onChange={() => toggleSelect(size._id)} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3 font-bold text-base">{size.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{size.label || "—"}</td>
                      <td className="px-4 py-3">{size.measurements?.chest ?? "—"}</td>
                      <td className="px-4 py-3">{size.measurements?.waist ?? "—"}</td>
                      <td className="px-4 py-3">{size.measurements?.length ?? "—"}</td>
                      <td className="px-4 py-3 cursor-pointer" onClick={() => toggleStatus(size._id)}>
                        <StatusBadge active={size.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(size)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(size._id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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

      <SizeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editData={editData} key={editData?._id || "new"} />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={async () => { await deleteSize(deleteId); setDeleteId(null); }}
        loading={deleting}
        title="Delete size?"
      />
      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={async () => { await bulkDelete([...selected]); setSelected(new Set()); setBulkDeleteOpen(false); }}
        loading={bulkDeleting}
        title={`Delete ${selected.size} sizes?`}
      />
    </div>
  );
}
