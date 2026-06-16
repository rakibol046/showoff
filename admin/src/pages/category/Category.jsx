import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetCategoriesQuery,
  useGetParentCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useToggleCategoryStatusMutation,
  useDeleteCategoryMutation,
} from "@/features/categories/categoriesApi";
import PageHeader from "@/components/common/PageHeader";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, ChevronDown, ChevronRight, Upload, X } from "lucide-react";

const TYPE_LABELS = { 1: "Parent", 2: "Child", 3: "Sub-child" };
const TYPE_COLORS = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-purple-100 text-purple-800",
  3: "bg-orange-100 text-orange-800",
};

// ── Form Dialog ───────────────────────────────────────────────────────────────
function CategoryFormDialog({ open, onOpenChange, editData, allCategories }) {
  const { data: parentCategories = [] } = useGetParentCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const saving = creating || updating;

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: editData
      ? {
          type: String(editData.type),
          name: editData.name,
          note: editData.note || "",
          status: editData.status,
          top: editData.top || false,
          parent_id: editData.parent_id?._id || editData.parent_id || "",
        }
      : { type: "1", name: "", note: "", status: true, top: false },
  });

  const type = watch("type");

  // Derive child categories (type 2) from allCategories for sub-child parent selection
  const childCategories = (allCategories || []).flatMap((cat) => cat.children || []);

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const removeLogo = () => { setLogoFile(null); setLogoPreview(null); };

  const handleClose = (v) => {
    if (!v) { reset(); setLogoFile(null); setLogoPreview(null); }
    onOpenChange(v);
  };

  const onSubmit = async (data) => {
    const fd = new FormData();
    fd.append("type", data.type);
    fd.append("name", data.name);
    fd.append("status", String(data.status));
    fd.append("top", String(!!data.top));
    if (data.note) fd.append("note", data.note);
    if (data.type !== "1" && data.parent_id) fd.append("parent_id", data.parent_id);
    if (logoFile) fd.append("logo", logoFile);

    const result = editData
      ? await updateCategory({ id: editData._id, formData: fd })
      : await createCategory(fd);

    if (!result.error) handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type */}
          <div>
            <Label>Type *</Label>
            <Select value={type} onValueChange={(v) => { setValue("type", v); setValue("parent_id", ""); }}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Parent</SelectItem>
                <SelectItem value="2">Child</SelectItem>
                <SelectItem value="3">Sub-child</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Parent selector (Child → pick from parents; Sub-child → pick from children) */}
          {type === "2" && (
            <div>
              <Label>Parent Category *</Label>
              <Select value={watch("parent_id") || ""} onValueChange={(v) => setValue("parent_id", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select parent" /></SelectTrigger>
                <SelectContent>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "3" && (
            <div>
              <Label>Parent Category (Child) *</Label>
              <Select value={watch("parent_id") || ""} onValueChange={(v) => setValue("parent_id", v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select child category" /></SelectTrigger>
                <SelectContent>
                  {childCategories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Name */}
          <div>
            <Label>Name *</Label>
            <Input
              className="mt-1"
              placeholder="e.g. Men's Clothing"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Note */}
          <div>
            <Label>Note</Label>
            <Textarea className="mt-1" placeholder="Optional note..." rows={2} {...register("note")} />
          </div>

          {/* Logo */}
          <div>
            <Label>Logo / Image</Label>
            <label className="mt-1 relative flex flex-col items-center gap-2 border-2 border-dashed rounded-lg p-5 cursor-pointer hover:bg-muted/50 transition-colors">
              {logoPreview ? (
                <>
                  <img src={logoPreview} alt="Preview" className="h-20 w-20 object-contain rounded" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeLogo(); }}
                    className="absolute top-2 right-2 p-0.5 rounded-full bg-muted hover:bg-destructive hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : editData?.logo_url && !logoFile ? (
                <>
                  <img src={`http://localhost:8080${editData.logo_url}`} alt="Current" className="h-20 w-20 object-contain rounded" />
                  <span className="text-xs text-muted-foreground">Click to replace</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
            </label>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={!!watch("status")} onCheckedChange={(v) => setValue("status", v)} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!watch("top")} onCheckedChange={(v) => setValue("top", v)} />
              <Label>Top Category</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : editData ? "Save Changes" : "Create Category"}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Category Row (recursive) ───────────────────────────────────────────────────
function CategoryRow({ cat, depth = 0, onEdit, onDelete, onToggle }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = cat.children?.length > 0;

  return (
    <>
      <tr className="border-b hover:bg-muted/30 transition-colors">
        {/* Name */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2" style={{ paddingLeft: depth * 20 }}>
            <button
              onClick={() => hasChildren && setExpanded((v) => !v)}
              className={`shrink-0 text-muted-foreground ${!hasChildren ? "invisible" : ""}`}
            >
              {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {cat.logo_url ? (
              <img
                src={`http://localhost:8080${cat.logo_url}`}
                alt={cat.name}
                className="w-7 h-7 object-cover rounded border shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded border bg-muted shrink-0" />
            )}
            <span className="font-medium">{cat.name}</span>
          </div>
        </td>

        {/* Type */}
        <td className="px-4 py-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[cat.type] || "bg-gray-100"}`}>
            {TYPE_LABELS[cat.type] || "Unknown"}
          </span>
        </td>

        {/* Status — click to toggle */}
        <td className="px-4 py-3 cursor-pointer" onClick={() => onToggle(cat)}>
          <StatusBadge active={cat.status} />
        </td>

        {/* Top */}
        <td className="px-4 py-3 text-center">
          {cat.top
            ? <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Yes</span>
            : <span className="text-muted-foreground text-xs">—</span>}
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(cat)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(cat._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>

      {/* Recursive children */}
      {expanded && hasChildren && cat.children.map((child) => (
        <CategoryRow
          key={child._id}
          cat={child}
          depth={depth + 1}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Category() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const [toggleStatus] = useToggleCategoryStatusMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const catList = Array.isArray(categories) ? categories : [];
  const filtered = catList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditData(null); setDialogOpen(true); };
  const openEdit = (cat) => { setEditData(cat); setDialogOpen(true); };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categories"
        subtitle={`${catList.length} parent categories`}
        actionLabel="Add Category"
        onAction={openAdd}
      />

      <div className="flex gap-3">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-muted/60 border-b">
              <tr>
                {["Name", "Type", "Status", "Top", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton rows={8} cols={5} />
            ) : (
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-muted-foreground">No categories found</td>
                  </tr>
                ) : (
                  filtered.map((cat) => (
                    <CategoryRow
                      key={cat._id}
                      cat={cat}
                      onEdit={openEdit}
                      onDelete={setDeleteId}
                      onToggle={(cat) => toggleStatus({ id: cat._id, status: cat.status })}
                    />
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <CategoryFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editData={editData}
        allCategories={catList}
        key={editData?._id || "new"}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={async () => { await deleteCategory(deleteId); setDeleteId(null); }}
        loading={deleting}
        title="Delete category?"
        description="This will also delete all child and sub-child categories. This action cannot be undone."
      />
    </div>
  );
}
