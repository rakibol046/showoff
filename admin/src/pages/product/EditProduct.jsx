import { useState, useEffect } from "react";
import { imgUrl, onImgError } from "@/lib/imageUrl";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useGetProductQuery, useUpdateProductMutation } from "@/features/products/productsApi";
import { useGetParentCategoriesQuery } from "@/features/categories/categoriesApi";
import { useGetColorsQuery } from "@/features/colors/colorsApi";
import { useGetSizesQuery } from "@/features/sizes/sizesApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, X, Upload } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProductQuery(id);
  const { data: categories } = useGetParentCategoriesQuery();
  const { data: colors } = useGetColorsQuery({ status: "true" });
  const { data: sizes } = useGetSizesQuery({ status: "true" });
  const [updateProduct, { isLoading: saving }] = useUpdateProductMutation();

  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        product_code: product.product_code,
        bar_code: product.bar_code,
        buy_price: product.buy_price,
        sell_price: product.sell_price,
        discount: product.discount,
        stock: product.stock,
        description: product.description,
        status: product.status,
        super_offer: product.super_offer,
      });
      setExistingImages(product.images || []);
      setSelectedCategories(product.category_id?.map((c) => c._id || c) || []);
      setSelectedColors(product.color_id?.map((c) => c._id || c) || []);
      setSelectedSizes(product.size_id?.map((s) => s._id || s) || []);
    }
  }, [product, reset]);

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeExisting = (i) => setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeNew = (i) => {
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const toggleItem = (id, list, setList) =>
    setList((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);

  const onSubmit = async (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null) fd.append(k, v);
    });
    newImageFiles.forEach((f) => fd.append("images", f));
    fd.append("existingImages", JSON.stringify(existingImages));
    fd.append("category_id", JSON.stringify(selectedCategories));
    fd.append("color_id", JSON.stringify(selectedColors));
    fd.append("size_id", JSON.stringify(selectedSizes));

    const result = await updateProduct({ id, formData: fd });
    if (!result.error) navigate("/products");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl space-y-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground text-sm">{product?.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Product Name *</Label>
              <Input className="mt-1" {...register("name", { required: true })} />
            </div>
            <div>
              <Label>Product Code</Label>
              <Input className="mt-1" {...register("product_code")} />
            </div>
            <div>
              <Label>Bar Code</Label>
              <Input className="mt-1" {...register("bar_code")} />
            </div>
            <div>
              <Label>Stock *</Label>
              <Input type="number" min="0" className="mt-1" {...register("stock")} />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={4} className="mt-1" {...register("description")} />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={!!watch("status")} onCheckedChange={(v) => setValue("status", v)} />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!watch("super_offer")} onCheckedChange={(v) => setValue("super_offer", v)} />
              <Label>Super Offer</Label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Buy Price ($)</Label><Input type="number" min="0" step="0.01" className="mt-1" {...register("buy_price")} /></div>
            <div><Label>Sell Price ($)</Label><Input type="number" min="0" step="0.01" className="mt-1" {...register("sell_price")} /></div>
            <div><Label>Discount (%)</Label><Input type="number" min="0" max="100" className="mt-1" {...register("discount")} /></div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {existingImages.map((src, i) => (
              <div key={`ex-${i}`} className="relative w-20 h-20">
                <img src={imgUrl(src)} alt="" onError={onImgError} className="w-full h-full object-cover rounded-lg border" />
                <button type="button" onClick={() => removeExisting(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {imagePreviews.map((src, i) => (
              <div key={`new-${i}`} className="relative w-20 h-20">
                <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-primary" />
                <button type="button" onClick={() => removeNew(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Add</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleNewImages} />
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {(categories || []).map((cat) => (
              <button key={cat._id} type="button" onClick={() => toggleItem(cat._id, selectedCategories, setSelectedCategories)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${selectedCategories.includes(cat._id) ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors & Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Colors</h2>
            <div className="flex flex-wrap gap-2">
              {(colors || []).map((c) => (
                <button key={c._id} type="button" onClick={() => toggleItem(c._id, selectedColors, setSelectedColors)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${selectedColors.includes(c._id) ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
                  <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold">Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {(sizes || []).map((s) => (
                <button key={s._id} type="button" onClick={() => toggleItem(s._id, selectedSizes, setSelectedSizes)}
                  className={`px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors ${selectedSizes.includes(s._id) ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="min-w-32">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
