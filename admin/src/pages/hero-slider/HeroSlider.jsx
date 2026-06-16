import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetSlidersQuery, useCreateSliderMutation, useUpdateSliderMutation,
  useToggleSliderStatusMutation, useDeleteSliderMutation,
} from "@/features/sliders/slidersApi";
import PageHeader from "@/components/common/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil, Trash2, Image, Upload } from "lucide-react";

function SliderFormDialog({ open, onOpenChange, editData }) {
  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: editData
      ? { name: editData.name, link: editData.link || "", status: editData.status }
      : { name: "", link: "", status: true },
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [createSlider, { isLoading: creating }] = useCreateSliderMutation();
  const [updateSlider, { isLoading: updating }] = useUpdateSliderMutation();
  const saving = creating || updating;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const onSubmit = async (data) => {
    const fd = new FormData();
    fd.append("name", data.name);
    if (data.link) fd.append("link", data.link);
    fd.append("status", data.status);
    if (imageFile) fd.append("image", imageFile);

    const result = editData
      ? await updateSlider({ id: editData._id, formData: fd })
      : await createSlider(fd);
    if (!result.error) {
      onOpenChange(false);
      reset();
      setImageFile(null);
      setImagePreview(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { reset(); setImageFile(null); setImagePreview(null); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Slider" : "Add Slider"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Slider Name *</Label>
            <Input className="mt-1" placeholder="e.g. Summer Sale Banner" {...register("name", { required: true })} />
          </div>
          <div>
            <Label>Link URL</Label>
            <Input className="mt-1" placeholder="https://..." {...register("link")} />
          </div>

          <div>
            <Label>Slider Image</Label>
            <label className="mt-1 flex flex-col items-center gap-3 border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="max-h-32 object-contain rounded" />
              ) : editData?.image ? (
                <img src={`http://localhost:8080${editData.image}`} alt="Current" className="max-h-32 object-contain rounded" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={!!watch("status")} onCheckedChange={(v) => setValue("status", v)} />
            <Label>Active</Label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? "Saving..." : editData ? "Save Changes" : "Add Slider"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function HeroSlider() {
  const { data: sliders, isLoading } = useGetSlidersQuery();
  const [toggleStatus] = useToggleSliderStatusMutation();
  const [deleteSlider, { isLoading: deleting }] = useDeleteSliderMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const sliderList = Array.isArray(sliders) ? sliders : [];

  const openAdd = () => { setEditData(null); setDialogOpen(true); };
  const openEdit = (s) => { setEditData(s); setDialogOpen(true); };

  return (
    <div className="space-y-6">
      <PageHeader title="Hero Sliders" subtitle={`${sliderList.length} sliders`} actionLabel="Add Slider" onAction={openAdd} />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 rounded-xl" />)}
        </div>
      ) : sliderList.length === 0 ? (
        <div className="border-2 border-dashed rounded-xl p-16 text-center">
          <Image className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">No sliders yet. Add your first hero banner.</p>
          <Button onClick={openAdd} className="mt-4">Add Slider</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sliderList.map((slider) => (
            <div key={slider._id} className="bg-card border rounded-xl overflow-hidden group">
              <div className="relative h-40 bg-muted">
                {slider.image ? (
                  <img
                    src={`http://localhost:8080${slider.image}`}
                    alt={slider.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button size="icon" variant="secondary" onClick={() => openEdit(slider)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => setDeleteId(slider._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{slider.name}</p>
                  {slider.link && <p className="text-xs text-muted-foreground truncate">{slider.link}</p>}
                </div>
                <div className="shrink-0 cursor-pointer" onClick={() => toggleStatus(slider._id)}>
                  <StatusBadge active={slider.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SliderFormDialog open={dialogOpen} onOpenChange={setDialogOpen} editData={editData} key={editData?._id || "new"} />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
        onConfirm={async () => { await deleteSlider(deleteId); setDeleteId(null); }}
        loading={deleting}
        title="Delete slider?"
        description="This will remove the slider from the hero section."
      />
    </div>
  );
}
