import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import logo from "../../assets/images/logo.svg";

export default function Login() {
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   console.log(formData);
  // };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <>
      <div
        className="fixed top-0 left-0 z-20 flex h-screen w-screen items-center justify-center bg-main backdrop-blur-sm"
        aria-labelledby="header-4a content-4a"
        aria-modal="true"
        tabindex="-1"
        role="dialog"
      >
        {/*    <!-- Modal --> */}
        <div
          className="flex max-h-[90vh] max-w-sm flex-col gap-4 overflow-hidden rounded bg-content p-6 shadow-xl"
          id="modal"
          role="document"
        >
          {/*        <!-- Modal header --> */}
          <header id="header-4a" className="flex items-center">
           <img className="mb-3" src={logo} />
          </header>
          {/*        <!-- Modal body --> */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
            <div className="flex flex-col gap-6">
              {/*                <!-- Input field --> */}
              <div className="relative">
                <input
                  {...register("email")}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  type="email"
                  placeholder="Email"
                  required
                  className="peer relative h-10 w-full rounded border px-4  outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-non disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                />
                <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition">
                  <span>Type your email address</span>
                </small>
              </div>
              {/*                <!-- Input field --> */}
              <div className="relative my-6">
                <input
                  {...register("password")}
                  type="password"
                  placeholder="password"
                  required
                  className="peer relative h-10 w-full text-white rounded border  px-4 pr-12  outline-none transition-all autofill:bg-white  focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed "
                />

                <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition">
                  <span>Type your password</span>
                </small>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              <button
                type="submit"
                className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
              >
                <span>Login</span>
              </button>
            </div>
          </form>
          {/*        <!-- Modal actions --> */}
        </div>
      </div>
      ,
    </>
  );
}
