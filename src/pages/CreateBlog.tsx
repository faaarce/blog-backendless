import { FileText, User, Image, File as FileEdit } from "lucide-react";
import Navbar from "../components/Navbar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../lib/axios";

/* ✅ Schema */
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  author: z.string().min(1, "Author is required"),
  thumbnail: z.instanceof(File).optional(),
  content: z.string().min(1, "Content is required"),
});

/* ✅ Type inferred from schema */
type FormDataCreateBlog = z.infer<typeof formSchema>;

const generateRandomString = (length: number = 10) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

interface FileServiceResponse {
  fileURL: string;
}

function CreateBlog() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema), // ❗ FIXED
  });

  const onSubmit = async (data: FormDataCreateBlog) => {
    try {
      const form = new FormData();
      form.append("file", data.thumbnail);
      const folderName = "images";
      const fileName = generateRandomString(10);
      const response = await axiosInstance.post(
        `/files/$(folderName)/$(fileName)`,
        form,
      );

      await axiosInstance.post(`/data/Blogs`, {
        thumbnail: response.data.fileURL,
        author: data.author,
        description: data.description,
        title: data.title,
        content: data.content
      });

      alert("Create Blog Success")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create New Blog
          </h1>
          <p className="text-gray-600 mb-8">
            Share your thoughts and ideas with the community
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="Enter your blog title"
                  {...register("title")}
                />
              </div>
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Write a brief description"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* AUTHOR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="Your name"
                  {...register("author")} // ❗ FIXED (was description)
                />
              </div>
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            {/* THUMBNAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue("thumbnail", file); // ❗ FIXED (added setValue)
                    }
                  }}
                />
              </div>
            </div>

            {/* CONTENT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div className="relative">
                <FileEdit className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  rows={12}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg"
                  placeholder="Write your blog content..."
                  {...register("content")}
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-yellow-500 text-white py-3 rounded-lg font-semibold"
              >
                Publish Blog
              </button>
              <button type="button" className="px-6 py-3 border rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBlog;
