import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCreateProductMutation } from "@/features/products/productsApi";
import { useGetParentCategoriesQuery } from "@/features/categories/categoriesApi";
import { useGetColorsQuery } from "@/features/colors/colorsApi";
import { useGetSizesQuery } from "@/features/sizes/sizesApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, X, Upload } from "lucide-react";

export default function CreateProduct() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { status: true, super_offer: false },
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const { data: categories } = useGetParentCategoriesQuery();
  const { data: colors } = useGetColorsQuery({ status: "true" });
  const { data: sizes } = useGetSizesQuery({ status: "true" });
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeImage = (i) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const toggleItem = (id, list, setList) => {
    setList((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  const onSubmit = async (data) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") fd.append(k, v);
    });
    imageFiles.forEach((f) => fd.append("images", f));
    fd.append("category_id", JSON.stringify(selectedCategories));
    fd.append("color_id", JSON.stringify(selectedColors));
    fd.append("size_id", JSON.stringify(selectedSizes));

    const result = await createProduct(fd);
    if (!result.error) navigate("/products");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Create a new product listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-base">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                className="mt-1"
                placeholder="e.g. Premium Cotton T-Shirt"
                {...register("name", { required: "Product name is required" })}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="product_code">Product Code</Label>
              <Input id="product_code" className="mt-1" placeholder="SKU-001" {...register("product_code")} />
            </div>
            <div>
              <Label htmlFor="bar_code">Bar Code</Label>
              <Input id="bar_code" className="mt-1" placeholder="Barcode" {...register("bar_code")} />
            </div>
            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input id="stock" type="number" min="0" className="mt-1" placeholder="0" {...register("stock", { required: true, min: 0 })} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" className="mt-1" rows={4} placeholder="Product description..." {...register("description")} />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("status")}
                onCheckedChange={(v) => setValue("status", v)}
              />
              <Label>Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={watch("super_offer")}
                onCheckedChange={(v) => setValue("super_offer", v)}
              />
              <Label>Super Offer</Label>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-base">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="buy_price">Buy Price ($)</Label>
              <Input id="buy_price" type="number" min="0" step="0.01" className="mt-1" placeholder="0.00" {...register("buy_price")} />
            </div>
            <div>
              <Label htmlFor="sell_price">Sell Price ($) *</Label>
              <Input id="sell_price" type="number" min="0" step="0.01" className="mt-1" placeholder="0.00" {...register("sell_price", { required: true })} />
            </div>
            <div>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input id="discount" type="number" min="0" max="100" className="mt-1" placeholder="0" {...register("discount")} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-base">Product Images</h2>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative w-20 h-20">
                <img src={src} alt={`img-${i}`} className="w-full h-full object-cover rounded-lg border" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground mt-1">Add</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImages} />
            </label>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-card border rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-base">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {(categories || []).map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => toggleItem(cat._id, selectedCategories, setSelectedCategories)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  selectedCategories.includes(cat._id)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted border-border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Colors & Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-base">Colors</h2>
            <div className="flex flex-wrap gap-2">
              {(colors || []).map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => toggleItem(c._id, selectedColors, setSelectedColors)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                    selectedColors.includes(c._id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted border-border"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h2 className="font-semibold text-base">Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {(sizes || []).map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => toggleItem(s._id, selectedSizes, setSelectedSizes)}
                  className={`px-3 py-1.5 rounded-lg text-sm border font-medium transition-colors ${
                    selectedSizes.includes(s._id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted border-border"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? "Saving..." : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
