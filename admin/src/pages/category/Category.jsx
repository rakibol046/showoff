import { useEffect, useState } from "react";
import CreateBtn from "../../components/common/CreateBTN";
import ShowTitle from "../../components/common/ShowTitle";
import { useGetCategoriesQuery } from "../../features/categories/categoriesApi";
import { Link } from "react-router";

const Category = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories!</p>;

  return (
    <>
      <div className="bg-content flex justify-between items-center rounded-md p-2 mb-4">
        {/* <ShowTitle name="categories" /> */}
        <div className="relative">
          <input
            id="id-s03"
            type="search"
            name="id-s03"
            placeholder="Search here"
            aria-label="Search content"
            className="peer relative h-10 w-full lg:w-96 rounded border border-white px-4 pr-12 text-sm  outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-4 top-2.5 h-5 w-5 cursor-pointer stroke-white peer-disabled:cursor-not-allowed"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            aria-label="Search icon"
            role="graphics-symbol"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
        <Link to={"/categories/add"}>
          <CreateBtn name="Create Category" />
        </Link>
      </div>

      <main>
        <div className="w-full overflow-x-auto shadow-amber-400">
          <table
            className="w-full text-left border-collapse  rounded w-overflow-x-auto bg-content"
            cellspacing="0"
          >
            <tbody>
              <tr className="border-b border-slate-300">
                <th scope="col" className="h-12 px-6">
                  Category
                </th>
                <th scope="col" className="h-12 px-6">
                  Type
                </th>

                <th scope="col" className="h-12 px-6 ">
                  Status
                </th>
                <th scope="col" className="h-12 px-6 text-right">
                  Action
                </th>
              </tr>
              {categories.map((category) => (
                <tr key={category._id} className="border-b border-[#454545]">
                  <td className="h-12 px-6  transition duration-300">
                    {category?.name}
                  </td>
                  <td className="h-12 px-6 transition duration-300">
                    {category?.type == 1 ? "Parent" : "Subcategory"}
                  </td>

                  <td className="h-12 px-6  transition duration-300  ">
                    {category?.status === true ? "Active" : "Deactive"}
                  </td>
                  <td className="h-12 px-6  transition duration-300 text-right">
                    <button className="bg-yellow-900 p-2 mr-2">Update</button>
                    <button className="bg-red-900 p-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};
export default Category;
