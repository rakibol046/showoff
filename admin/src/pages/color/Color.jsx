import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetColorsQuery, useCreateColorMutation, useUpdateColorMutation,
  useToggleColorStatusMutation, useDeleteColorMutation, useBulkDeleteColorsMutation,
} from "@/features/colors/colorsApi";
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

const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

function ColorFormDialog({ open, onOpenChange, editData }) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: editData || { name: "", value: "", hex: "#6366f1", status: true },
  });
  const [createColor, { isLoading: creating }] = useCreateColorMutation();
  const [updateColor, { isLoading: updating }] = useUpdateColorMutation();
  const isLoading = creating || updating;

  const hex = watch("hex");

  const onSubmit = async (data) => {
    const result = editData
      ? await updateColor({ id: editData._id, ...data })
      : await createColor(data);
    if (!result.error) { onOpenChange(false); reset(); }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Color" : "Add Color"}</DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div
          className="h-16 rounded-lg border flex items-center justify-center"
          style={{ backgroundColor: HEX_REGEX.test(hex) ? hex : "#e5e7eb" }}
        >
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm">
            {watch("name") || "Preview"}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input className="mt-1" placeholder="Midnight Blue" {...register("name", { required: "Required" })} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Value / Code</Label>
            <Input className="mt-1" placeholder="midnight-blue" {...register("value")} />
          </div>

          <div>
            <Label>Hex Color *</Label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={HEX_REGEX.test(hex) ? hex : "#6366f1"}
                onChange={(e) => setValue("hex", e.target.value)}
                className="w-10 h-10 rounded border cursor-pointer p-0.5"
              />
              <Input
                {...register("hex", {
                  required: "Required",
                  pattern: { value: HEX_REGEX, message: "Invalid hex (e.g. #FF0000)" },
                })}
                placeholder="#000000"
              />
              <div className="w-10 h-10 rounded border shrink-0" style={{ backgroundColor: HEX_REGEX.test(hex) ? hex : "#e5e7eb" }} />
            </div>
            {errors.hex && <p className="text-xs text-red-500 mt-1">{errors.hex.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={!!watch("status")} onCheckedChange={(v) => setValue("status", v)} />
            <Label>Active</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : editData ? "Save Changes" : "Add Color"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ColorManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const params = {};
  if (statusFilter !== "all") params.status = statusFilter;
  const { data: colors = [], isLoading } = useGetColorsQuery(params);

  const [toggleStatus] = useToggleColorStatusMutation();
  const [deleteColor, { isLoading: deleting }] = useDeleteColorMutation();
  const [bulkDelete, { isLoading: bulkDeleting }] = useBulkDeleteColorsMutation();

  const filtered = (Array.isArray(colors) ? colors : []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.hex || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => setSelected((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(filtered.map((c) => c._id)));

  const openAdd = () => { setEditData(null); setDialogOpen(true); };
  const openEdit = (c) => { setEditData(c); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <PageHeader title="Colors" subtitle={`${(Array.isArray(colors) ? colors : []).length} colors total`} actionLabel="Add Color" onAction={openAdd} />

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <Input placeholder="Search colors..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
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
          <table className="w-full text-sm min-w-[550px]">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="cursor-pointer" />
                </th>
                {["Swatch", "Name", "Value", "Hex", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton rows={8} cols={7} />
            ) : (
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">No colors found</td></tr>
                ) : (
                  filtered.map((color) => (
                    <tr key={color._id} className="border-b hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3">
                        <input type="checkbox" checked={selected.has(color._id)} onChange={() => toggleSelect(color._id)} className="cursor-pointer" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: color.hex }} title={color.hex} />
                      </td>
                      <td className="px-4 py-3 font-medium">{color.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{color.value || "—"}</td>
                      <td className="px-4 py-3">
                        <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{color.hex}</code>
                      </td>
                      <td className="px-4 py-3 cursor-pointer" onClick={() => toggleStatus(color._id)}>
                        <StatusBadge active={color.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(color)}><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(color._id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
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

      <ColorFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editData={editData} key={editData?._id || "new"} />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={async () => { await deleteColor(deleteId); setDeleteId(null); }}
        loading={deleting}
        title="Delete color?"
      />
      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={async () => { await bulkDelete([...selected]); setSelected(new Set()); setBulkDeleteOpen(false); }}
        loading={bulkDeleting}
        title={`Delete ${selected.size} colors?`}
        description="This will permanently delete all selected colors."
      />
    </div>
  );
}
