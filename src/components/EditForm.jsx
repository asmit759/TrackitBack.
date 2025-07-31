import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast,Slide } from "react-toastify";
import { useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3002/items/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const item = await res.json();
        if (!res.ok) {
          throw new Error(item.message || "Failed to fetch item");
        }

        setValue("title", item.title || "");
        setValue("description", item.description || "");
        setValue("location", item.location || "");
        // setValue("status", item.status || "");
        if (item.date_reported) {
          setValue("date", item.date_reported.split("T")[0]);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchItem();
  }, [id, setValue]);

  async function onSubmit(data) {
    if (isSubmitting || isCooldown) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:3002/items/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          location: data.location,
          // status: data.status,
          date_reported: data.date,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update item");
        return;
      }

      toast.success("Item updated successfully!");
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
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white/10 backdrop-blur-md w-full max-w-md sm:max-w-lg rounded-2xl py-9 border-8 shadow-white border-white">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center gap-6 px-6"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("title", {
              required: "Title is required",
              minLength: { value: 3, message: "Min length at least 3" },
            })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1 w-full">{errors.title.message}</p>
          )}

          <input
            type="text"
            placeholder="Description Max Char: 36"
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("description", {
              required: "Description is required",
              minLength: { value: 3, message: "Min length at least 3" },
            })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1 w-full">{errors.description.message}</p>
          )}

          <input
            type="text"
            placeholder="Location"
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("location", {
              required: "Location is required",
              minLength: { value: 3, message: "Min length at least 3" },
            })}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1 w-full">{errors.location.message}</p>
          )}

          {/* <select
            className="w-full border border-white/65 p-3 rounded-xl text-white bg-black/40"
            {...register("status", { required: "Status is required" })}
          >
            <option value="">Select Status</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1 w-full">{errors.status.message}</p>
          )} */}

          <input
            type="date"
            className="w-full border border-white/65 p-3 rounded-xl placeholder:text-white focus:bg-white focus:text-black transition-all text-amber-50"
            {...register("date", {
              required: "Date is required",
            })}
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1 w-full">{errors.date.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isCooldown}
            className={`w-full border border-white/65 p-3 rounded-xl text-white transition-all ease-in ${
              isSubmitting || isCooldown
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-400/20 hover:bg-yellow-400 hover:text-gray-800"
            }`}
          >
            {isSubmitting ? "Submitting..." : isCooldown ? "Wait 15s..." : "Edit Post"}
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
