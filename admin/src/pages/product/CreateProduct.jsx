import { useState } from "react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function CreateProduct() {
  const [productImages, setProductImages] = useState([]);
  const [variants, setVariants] = useState([]);

  // ---- Handle images ----
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prev) => [...prev, ...files]);
  };

  // ---- Add Variant ----
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        size: "",
        color: "",
        sell_price: 0,
        stock: 0,
        sku: "",
        image: null,
      },
    ]);
  };

  // ---- Update Variant ----
  const updateVariant = (i, key, value) => {
    const updated = [...variants];
    updated[i][key] = value;
    setVariants(updated);
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-sm space-y-6">
      {/* PRODUCT BASIC INFO */}
      <div className="grid grid-cols-2 gap-6">
        <Field name="product_code">
          <FieldLabel>Product Code</FieldLabel>
          <Input placeholder="Enter product code" />
          <FieldError />
        </Field>

        <Field name="bar_code">
          <FieldLabel>Bar Code</FieldLabel>
          <Input placeholder="Enter bar code" />
          <FieldError />
        </Field>

        <Field name="name">
          <FieldLabel>Product Name</FieldLabel>
          <Input placeholder="Enter product name" />
          <FieldError />
        </Field>

        <Field name="status">
          <FieldLabel>Status</FieldLabel>
          <Switch defaultChecked />
        </Field>
      </div>

      {/* CATEGORY MULTI SELECT */}
      <Field name="category_id">
        <FieldLabel>Select Categories</FieldLabel>
        <select multiple className="border rounded p-2 w-full">
          {/* map categories here */}
          <option value="1">Fashion</option>
          <option value="2">Electronics</option>
        </select>
        <FieldError />
      </Field>

      {/* PRICING */}
      <div className="grid grid-cols-3 gap-6">
        <Field name="buy_price">
          <FieldLabel>Buy Price</FieldLabel>
          <Input type="number" placeholder="0" />
          <FieldError />
        </Field>

        <Field name="sell_price">
          <FieldLabel>Sell Price</FieldLabel>
          <Input type="number" placeholder="0" />
          <FieldError />
        </Field>

        <Field name="discount">
          <FieldLabel>Discount (%)</FieldLabel>
          <Input type="number" placeholder="0" />
          <FieldError />
        </Field>
      </div>

      {/* SUPER OFFER */}
      <Field name="super_offer">
        <FieldLabel>Super Offer</FieldLabel>
        <Switch />
      </Field>

      {/* DESCRIPTION */}
      <Field name="description">
        <FieldLabel>Description</FieldLabel>
        <Textarea rows="4" placeholder="Enter product description..." />
        <FieldError />
      </Field>

      {/* THUMBNAIL */}
      <Field name="thumbnail">
        <FieldLabel>Thumbnail Image</FieldLabel>
        <Input type="file" accept="image/*" />
        <FieldError />
      </Field>

      {/* GALLERY IMAGES */}
      <Field name="product_images">
        <FieldLabel>Product Gallery Images</FieldLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
        />
        <FieldError />
      </Field>

      {/* VIDEO */}
      <Field name="product_video">
        <FieldLabel>Product Video</FieldLabel>
        <Input type="file" accept="video/*" />
        <FieldError />
      </Field>

      {/* VARIANTS */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">Variants</h3>
          <Button onClick={addVariant}>Add Variant</Button>
        </div>

        {variants.map((v, idx) => (
          <div
            key={idx}
            className="border p-4 rounded-xl mb-4 grid grid-cols-3 gap-4"
          >
            {/* Size */}
            <Field name={`variants.${idx}.size`}>
              <FieldLabel>Size</FieldLabel>
              <select
                className="border p-2 rounded"
                onChange={(e) => updateVariant(idx, "size", e.target.value)}
              >
                <option value="">Select Size</option>
                <option value="S">Small</option>
                <option value="M">Medium</option>
              </select>
              <FieldError />
            </Field>

            {/* Color */}
            <Field name={`variants.${idx}.color`}>
              <FieldLabel>Color</FieldLabel>
              <select
                className="border p-2 rounded"
                onChange={(e) => updateVariant(idx, "color", e.target.value)}
              >
                <option value="">Select Color</option>
                <option value="red">Red</option>
                <option value="black">Black</option>
              </select>
              <FieldError />
            </Field>

            {/* Sell Price */}
            <Field name={`variants.${idx}.sell_price`}>
              <FieldLabel>Variant Sell Price</FieldLabel>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) =>
                  updateVariant(idx, "sell_price", e.target.value)
                }
              />
              <FieldError />
            </Field>

            {/* Stock */}
            <Field name={`variants.${idx}.stock`}>
              <FieldLabel>Stock</FieldLabel>
              <Input
                type="number"
                placeholder="0"
                onChange={(e) => updateVariant(idx, "stock", e.target.value)}
              />
              <FieldError />
            </Field>

            {/* SKU */}
            <Field name={`variants.${idx}.sku`}>
              <FieldLabel>SKU</FieldLabel>
              <Input
                placeholder="SKU"
                onChange={(e) => updateVariant(idx, "sku", e.target.value)}
              />
              <FieldError />
            </Field>

            {/* Variant Image */}
            <Field name={`variants.${idx}.image`}>
              <FieldLabel>Variant Image</FieldLabel>
              <Input type="file" accept="image/*" />
              <FieldError />
            </Field>
          </div>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <Button type="submit" className="w-full">
        Save Product
      </Button>
    </div>
  );
}
