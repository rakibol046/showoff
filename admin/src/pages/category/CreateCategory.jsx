import { useEffect, useState } from "react";
import CreateBtn from "../../components/common/CreateBTN";
import ShowTitle from "../../components/common/ShowTitle";
import {
  useGetParentCategoriesQuery,
  useAddCategoryMutation,
} from "../../features/categories/categoriesApi";
import { useForm } from "react-hook-form";

const CreateCategory = () => {
  const { data: categories, error, isLoading } = useGetParentCategoriesQuery();
  const [addCategory, { isSuccess: isAddCategorySuccess }] =
    useAddCategoryMutation();
  console.log("hi ", categories);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    addCategory(data);
    console.log(data);
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories!</p>;

  return (
    <>
      <div>Create category</div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-content p-4 max-w-4xl m-auto rounded"
      >
        <div class="relative my-6">
          <input
            {...register("name")}
            type="text"
            placeholder="your name"
            required
            class="relative w-full h-12 px-4 placeholder-transparent transition-all border rounded outline-none focus-visible:outline-none peer border-slate-200  autofill:bg-amber-200 invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <label
            for="id-l01"
            class="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#303030] before:transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:"
          >
            Category name
          </label>
        </div>

        <div className="relative my-6">
          <select
            {...register("type")}
            required
            className="peer relative h-12 w-full bg-content appearance-none rounded border border-slate-200 px-4  outline-none transition-all autofill:bg-red-200 focus:border-emerald-500 focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="" disabled selected></option>
            <option value="1">Main category</option>
            <option value="2">Sub category</option>
          </select>
          <label
            for="id-10"
            className="pointer-events-none absolute top-3 left-2 z-[1] px-2 text-base  transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#303030] before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Category type
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute top-3.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-emerald-500 peer-disabled:cursor-not-allowed"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-labelledby="title-10 description-10"
            role="graphics-symbol"
          >
            <title id="title-10">Arrow Icon</title>
            <desc id="description-10">Arrow icon of the select list.</desc>
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="relative my-6">
          <select
            {...register("parent_id")}
            // required
            className="peer relative h-12 w-full bg-content appearance-none rounded border border-slate-200 px-4  outline-none transition-all autofill:bg-red-200 focus:border-emerald-500 focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="" disabled selected></option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <label
            for="id-10"
            className="pointer-events-none absolute top-3 left-2 z-[1] px-2 text-base  transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#303030] before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
          >
            Parent category
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute top-3.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-emerald-500 peer-disabled:cursor-not-allowed"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-labelledby="title-10 description-10"
            role="graphics-symbol"
          >
            <title id="title-10">Arrow Icon</title>
            <desc id="description-10">Arrow icon of the select list.</desc>
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="relative my-6">
          <select
            {...register("status")}
            className="peer relative h-12 w-full bg-content appearance-none rounded border border-slate-200 px-4  outline-none transition-all autofill:bg-red-200 focus:border-emerald-500 focus-visible:outline-none focus:focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="true" selected>
              Active
            </option>
            <option value="false">Deactive</option>
          </select>
          <label className="pointer-events-none absolute top-3 left-2 z-[1] px-2 text-base  transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-[#303030] before:transition-all peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-valid:-top-2 peer-valid:text-xs peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent">
            Status
          </label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none absolute top-3.5 right-2 h-5 w-5 fill-slate-400 transition-all peer-focus:fill-emerald-500 peer-disabled:cursor-not-allowed"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-labelledby="title-10 description-10"
            role="graphics-symbol"
          >
            <title id="title-10">Arrow Icon</title>
            <desc id="description-10">Arrow icon of the select list.</desc>
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="relative my-6">
          <input
            id="id-dropzone02"
            name="file-upload"
            type="file"
            className="peer hidden"
            accept=".gif,.jpg,.png,.jpeg"
            multiple
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

        <div className="flex justify-center gap-2 mt-4">
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
          >
            <span>Create Category</span>
          </button>
        </div>
      </form>
    </>
  );
};
export default CreateCategory;
