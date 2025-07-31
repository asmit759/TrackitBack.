import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { ToastContainer, toast,Slide } from 'react-toastify';

const Post = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  async function onSubmit(data) {
    if (isSubmitting || isCooldown) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("location", data.location);
      // formData.append("status", data.status);
      formData.append("date_reported", data.date);

      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput && imageInput.files.length > 0) {
        formData.append("image", imageInput.files[0]);
      }

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3002/items", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to post item");
        setIsSubmitting(false);
        return;
      }

      toast.success("Form submitted successfully!");
      reset();

      setIsCooldown(true);
      setTimeout(() => setIsCooldown(false), 15000);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl py-9 border-8 shadow-white border-white w-full max-w-md sm:max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 px-4 sm:px-8">
          <input
            type="text"
            placeholder="Title"
            aria-invalid={errors.title ? "true" : "false"}
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("title", {
              required: true,
              minLength: { value: 3, message: "Minimum length is 3" },
            })}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}

          <input
            type="text"
            placeholder="Description Max char: 36"
            aria-invalid={errors.description ? "true" : "false"}
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("description", {
              required: true,
              minLength: { value: 3, message: "Minimum length is 3" },
            })}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}

          <input
            type="text"
            placeholder="Location"
            aria-invalid={errors.location ? "true" : "false"}
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("location", {
              required: true,
              minLength: { value: 3, message: "Minimum length is 3" },
            })}
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}

          {/* <select
            aria-invalid={errors.status ? "true" : "false"}
            className="w-full border border-white/65 p-3 rounded-xl text-white bg-black/40"
            {...register("status", { required: true })}
          >
            <option value="">Select Status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          {errors.status && <p className="text-red-500 text-sm mt-1">Status is required</p>} */}

          <input
            type="file"
            accept="image/*"
            className="w-full border border-white/65 p-3 rounded-xl text-white cursor-pointer file:border file:border-white/65 file:bg-white/10 file:backdrop-blur-md file:p-2 file:rounded-md focus:bg-white focus:text-black transition-all focus:file:bg-black focus:file:text-white"
          />

          <input
            type="date"
            aria-invalid={errors.date ? "true" : "false"}
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("date", {
              required: true,
              message: "Enter a valid Date",
            })}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting || isCooldown}
            className={`w-full border border-white/65 p-3 rounded-xl text-white transition-all ease-in ${
              isSubmitting || isCooldown
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400/20 hover:bg-yellow-400 hover:text-gray-800"
            }`}
          >
            {isSubmitting ? "Submitting..." : isCooldown ? "Wait 15s..." : "Submit"}
          </button>
        </form>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Slide}
        limit={1}
      />
    </div>
  );
};

export default Post;
