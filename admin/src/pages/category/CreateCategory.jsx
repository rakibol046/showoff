import { useState, useEffect } from "react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AddCategoryForm() {
  const [type, setType] = useState(1); // 1 = Parent, 2 = Child
  const [parentId, setParentId] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(true);
  const [note, setNote] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);

  // Fetch main categories for child selection
  useEffect(() => {
    fetch("http://localhost:8080/admin_api/category/parent/all")
      .then((res) => res.json())
      .then((data) => setMainCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let logoBase64 = null;
    if (logoFile) {
      logoBase64 = await fileToBase64(logoFile);
    }

    const payload = {
      type,
      name,
      status,
      note,
      parent_id: type === 2 ? parentId : null,
      logo_url: logoBase64,
    };

    console.log("Payload to backend:", payload);

    const res = await fetch("http://localhost:8080/admin_api/category/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.status === true) {
      toast.success("Category has been created");
    } else {
      toast.error("Faild to create category");
    }
    console.log("Backend response:", data);

    handleReset();
  };

  const handleReset = () => {
    setType(1);
    setParentId("");
    setName("");
    setStatus(true);
    setNote("");
    setLogoFile(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Add Category</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* CATEGORY TYPE */}
        <Field name="type">
          <FieldLabel>Category Type</FieldLabel>
          <Select
            value={String(type)}
            onValueChange={(v) => setType(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Parent</SelectItem>
              <SelectItem value="2">Child</SelectItem>
            </SelectContent>
          </Select>
          <FieldError />
        </Field>

        {/* PARENT CATEGORY (only for Child) */}
        {type === 2 && (
          <Field name="parent_id">
            <FieldLabel>Parent Category</FieldLabel>
            <Select value={parentId} onValueChange={setParentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                {mainCategories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError />
          </Field>
        )}

        {/* NAME */}
        <Field name="name">
          <FieldLabel>Category Name</FieldLabel>
          <Input
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FieldError />
        </Field>

        {/* STATUS */}
        <Field name="status">
          <FieldLabel>Status</FieldLabel>
          <Select
            value={String(status)}
            onValueChange={(v) => setStatus(v === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <FieldError />
        </Field>

        {/* NOTE */}
        <Field name="note">
          <FieldLabel>Note</FieldLabel>
          <Textarea
            placeholder="Optional note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <FieldError />
        </Field>

        {/* LOGO */}
        <Field name="logo_url">
          <FieldLabel>Logo / Image</FieldLabel>
          {/* <Input type="file" accept="image/*" onChange={handleFileChange} /> */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-20 w-20 object-contain rounded"
            />
          )}
          <FieldError />
        </Field>

        <div className="relative my-6">
          <input
            id="id-dropzone02"
            name="file-upload"
            type="file"
            className="peer hidden"
            accept=".gif,.jpg,.png,.jpeg"
            multiple
            onChange={handleFileChange}
          />

          <label
            for="id-dropzone02"
            className="flex cursor-pointer flex-col items-center gap-6 rounded border border-dashed border-slate-300 px-6 py-10 text-center"
          >
            <span className="inline-flex h-12 items-center justify-center self-center rounded bg-white px-3 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="File input icon"
                role="graphics-symbol"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
                />
              </svg>
            </span>
            <p className="flex flex-col items-center justify-center gap-1 text-sm">
              <span className="text-emerald-500 hover:text-emerald-500">
                Upload media
                <span className="text-slate-500"> or drag and drop </span>
              </span>
              <span className="text-slate-600">
                {" "}
                PNG, JPG or GIF up to 10MB{" "}
              </span>
            </p>
          </label>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button type="submit" className="flex-1">
            Save Category
          </Button>
        </div>
      </form>
    </div>
  );
}
